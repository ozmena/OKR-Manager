// Supabase storage service - CRUD operations for OKRs with real-time support

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { OKR } from '../types';
import { dbToOKR, okrToDBInsert, okrToDBUpdate } from './dataTransform';
import type { OKRRow, KeyResultRow, QualityChecklistRow, ActionRow } from '../lib/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Fetch all OKRs with their key results and checklists
export async function getOKRsFromSupabase(): Promise<OKR[]> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Fetch all tables in parallel
  const [okrsResult, keyResultsResult, checklistResult, actionsResult] = await Promise.all([
    supabase.from('okrs').select('*').order('created_at', { ascending: true }),
    supabase.from('key_results').select('*'),
    supabase.from('quality_checklist').select('*'),
    supabase.from('actions').select('*'),
  ]);

  if (okrsResult.error) throw okrsResult.error;
  if (keyResultsResult.error) throw keyResultsResult.error;
  if (checklistResult.error) throw checklistResult.error;
  if (actionsResult.error) throw actionsResult.error;

  const okrRows = okrsResult.data as OKRRow[];
  const keyResultRows = keyResultsResult.data as KeyResultRow[];
  const checklistRows = checklistResult.data as QualityChecklistRow[];
  const actionRows = actionsResult.data as ActionRow[];

  // Group key results, checklist items, and actions by OKR ID
  const keyResultsByOkr = new Map<string, KeyResultRow[]>();
  const checklistByOkr = new Map<string, QualityChecklistRow[]>();
  const actionsByOkr = new Map<string, ActionRow[]>();

  keyResultRows.forEach(kr => {
    const existing = keyResultsByOkr.get(kr.okr_id) || [];
    existing.push(kr);
    keyResultsByOkr.set(kr.okr_id, existing);
  });

  checklistRows.forEach(item => {
    const existing = checklistByOkr.get(item.okr_id) || [];
    existing.push(item);
    checklistByOkr.set(item.okr_id, existing);
  });

  actionRows.forEach(action => {
    const existing = actionsByOkr.get(action.okr_id) || [];
    existing.push(action);
    actionsByOkr.set(action.okr_id, existing);
  });

  // Transform to OKR objects
  const okrs = okrRows.map(okrRow =>
    dbToOKR(
      okrRow,
      keyResultsByOkr.get(okrRow.id) || [],
      checklistByOkr.get(okrRow.id) || [],
      actionsByOkr.get(okrRow.id) || []
    )
  );

  // Sort: global OKRs by displayId number, children by createdAt
  return okrs.sort((a, b) => {
    if (a.displayId && b.displayId) {
      const aNum = parseInt(a.displayId.replace(/\D/g, ''), 10) || 0;
      const bNum = parseInt(b.displayId.replace(/\D/g, ''), 10) || 0;
      return aNum - bNum;
    }
    if (a.displayId) return -1;
    if (b.displayId) return 1;
    const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return timeDiff !== 0 ? timeDiff : a.id.localeCompare(b.id);
  });
}

// Add a new OKR
export async function addOKRToSupabase(okr: OKR): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { okrData, keyResultsData, checklistData, actionsData } = okrToDBInsert(okr);

  // Insert OKR first
  const { error: okrError } = await supabase.from('okrs').insert(okrData);
  if (okrError) throw okrError;

  // Insert key results if any
  if (keyResultsData.length > 0) {
    const { error: krError } = await supabase.from('key_results').insert(keyResultsData);
    if (krError) throw krError;
  }

  // Insert checklist items if any
  if (checklistData.length > 0) {
    const { error: checklistError } = await supabase.from('quality_checklist').insert(checklistData);
    if (checklistError) throw checklistError;
  }

  // Insert actions if any
  if (actionsData.length > 0) {
    const { error: actionsError } = await supabase.from('actions').insert(actionsData);
    if (actionsError) throw actionsError;
  }
}

// Update an existing OKR
export async function updateOKRInSupabase(okr: OKR): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { okrData } = okrToDBUpdate(okr);
  const { keyResultsData, checklistData, actionsData } = okrToDBInsert(okr);

  // Update OKR
  const { error: okrError } = await supabase
    .from('okrs')
    .update(okrData)
    .eq('id', okr.id);
  if (okrError) throw okrError;

  // Delete existing key results and insert new ones (simpler than upsert logic)
  const { error: deleteKrError } = await supabase
    .from('key_results')
    .delete()
    .eq('okr_id', okr.id);
  if (deleteKrError) throw deleteKrError;

  if (keyResultsData.length > 0) {
    const { error: krError } = await supabase.from('key_results').insert(keyResultsData);
    if (krError) throw krError;
  }

  // Delete existing checklist and insert new ones
  const { error: deleteChecklistError } = await supabase
    .from('quality_checklist')
    .delete()
    .eq('okr_id', okr.id);
  if (deleteChecklistError) throw deleteChecklistError;

  if (checklistData.length > 0) {
    const { error: checklistError } = await supabase.from('quality_checklist').insert(checklistData);
    if (checklistError) throw checklistError;
  }

  // Delete existing actions and insert new ones
  const { error: deleteActionsError } = await supabase
    .from('actions')
    .delete()
    .eq('okr_id', okr.id);
  if (deleteActionsError) throw deleteActionsError;

  if (actionsData.length > 0) {
    const { error: actionsError } = await supabase.from('actions').insert(actionsData);
    if (actionsError) throw actionsError;
  }
}

// Delete an OKR (cascade delete is handled by database foreign keys)
export async function deleteOKRFromSupabase(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase.from('okrs').delete().eq('id', id);
  if (error) throw error;
}

// Subscribe to real-time changes
export function subscribeToOKRChanges(
  onDataChange: () => void
): RealtimeChannel | null {
  if (!supabase) {
    return null;
  }

  const channel = supabase
    .channel('okr-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'okrs' },
      () => onDataChange()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'key_results' },
      () => onDataChange()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'quality_checklist' },
      () => onDataChange()
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'actions' },
      () => onDataChange()
    )
    .subscribe();

  return channel;
}

// Unsubscribe from real-time changes
export function unsubscribeFromOKRChanges(channel: RealtimeChannel | null): void {
  if (channel && supabase) {
    supabase.removeChannel(channel);
  }
}

// Export configuration check
export { isSupabaseConfigured };
