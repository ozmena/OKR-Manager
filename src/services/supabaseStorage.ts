// Supabase storage service - CRUD operations for OKRs with real-time support

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { OKR } from '../types';
import { dbToOKR, okrToDBInsert, okrToDBUpdate } from './dataTransform';
import type { OKRRow, KeyResultRow, QualityChecklistRow } from '../lib/database.types';
import type { RealtimeChannel } from '@supabase/supabase-js';

// Fetch all OKRs with their key results and checklists
export async function getOKRsFromSupabase(): Promise<OKR[]> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  // Fetch all tables in parallel
  const [okrsResult, keyResultsResult, checklistResult] = await Promise.all([
    supabase.from('okrs').select('*').order('created_at', { ascending: true }),
    supabase.from('key_results').select('*'),
    supabase.from('quality_checklist').select('*'),
  ]);

  if (okrsResult.error) throw okrsResult.error;
  if (keyResultsResult.error) throw keyResultsResult.error;
  if (checklistResult.error) throw checklistResult.error;

  const okrRows = okrsResult.data as OKRRow[];
  const keyResultRows = keyResultsResult.data as KeyResultRow[];
  const checklistRows = checklistResult.data as QualityChecklistRow[];

  // Group key results and checklist items by OKR ID
  const keyResultsByOkr = new Map<string, KeyResultRow[]>();
  const checklistByOkr = new Map<string, QualityChecklistRow[]>();

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

  // Transform to OKR objects
  return okrRows.map(okrRow =>
    dbToOKR(
      okrRow,
      keyResultsByOkr.get(okrRow.id) || [],
      checklistByOkr.get(okrRow.id) || []
    )
  );
}

// Add a new OKR
export async function addOKRToSupabase(okr: OKR): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { okrData, keyResultsData, checklistData } = okrToDBInsert(okr);

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
}

// Update an existing OKR
export async function updateOKRInSupabase(okr: OKR): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { okrData } = okrToDBUpdate(okr);
  const { keyResultsData, checklistData } = okrToDBInsert(okr);

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
