// Data transformation utilities between Supabase database format and app OKR types

import { OKR, KeyResult, KeyResultStatus, KeyResultUnit, OKRStatus, QualityChecklistItem, Action } from '../types';
import type { OKRRow, KeyResultRow, QualityChecklistRow, ActionRow } from '../lib/database.types';

// Convert database rows to app OKR type
export function dbToOKR(
  okrRow: OKRRow,
  keyResultRows: KeyResultRow[],
  checklistRows: QualityChecklistRow[],
  actionRows: ActionRow[] = []
): OKR {
  const keyResults: KeyResult[] = keyResultRows
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(kr => ({
      id: kr.id,
      metricName: kr.metric_name,
      from: kr.from_value,
      to: kr.to_value,
      unit: (kr.unit as KeyResultUnit) || 'percentage',
      current: kr.current_value ?? undefined,
      status: (kr.status as KeyResultStatus) || undefined,
      function: kr.function || undefined,
    }));

  const qualityChecklist: QualityChecklistItem[] | undefined =
    checklistRows.length > 0
      ? checklistRows.map(item => ({
          id: item.item_id,
          checked: item.checked,
        }))
      : undefined;

  const actions: Action[] | undefined =
    actionRows.length > 0
      ? actionRows.map(action => ({
          id: action.id,
          text: action.text,
          owner: action.owner,
          dueDate: action.due_date,
          completed: action.completed,
          completedAt: action.completed_at || undefined,
          createdAt: action.created_at,
        }))
      : undefined;

  return {
    id: okrRow.id,
    displayId: okrRow.display_id || undefined,
    objective: okrRow.objective,
    keyResults,
    createdAt: okrRow.created_at,
    parentId: okrRow.parent_id || undefined,
    area: okrRow.area || undefined,
    owner: okrRow.owner || undefined,
    challenges: okrRow.challenges || undefined,
    needs: okrRow.needs || undefined,
    comments: okrRow.comments || undefined,
    status: (['on-track', 'progressing', 'off-track'].includes(okrRow.status || '') ? okrRow.status as OKRStatus : undefined),
    qualityChecklist,
    actions,
  };
}

// Convert app OKR type to database insert format
export function okrToDBInsert(okr: OKR): {
  okrData: {
    id: string;
    display_id: string | null;
    objective: string;
    created_at: string;
    parent_id: string | null;
    area: string | null;
    owner: string | null;
    challenges: string | null;
    needs: string | null;
    comments: string | null;
    status: string | null;
  };
  keyResultsData: {
    id: string;
    okr_id: string;
    metric_name: string;
    from_value: number;
    to_value: number;
    unit: string;
    current_value: number | null;
    status: string | null;
    function: string | null;
    sort_order: number;
  }[];
  checklistData: {
    okr_id: string;
    item_id: string;
    checked: boolean;
  }[];
  actionsData: {
    id: string;
    okr_id: string;
    text: string;
    owner: string;
    due_date: string;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
  }[];
} {
  const okrData = {
    id: okr.id,
    display_id: okr.displayId || null,
    objective: okr.objective,
    created_at: okr.createdAt,
    parent_id: okr.parentId || null,
    area: okr.area || null,
    owner: okr.owner || null,
    challenges: okr.challenges || null,
    needs: okr.needs || null,
    comments: okr.comments || null,
    status: okr.status || null,
  };

  const keyResultsData = okr.keyResults.map((kr, index) => ({
    id: kr.id,
    okr_id: okr.id,
    metric_name: kr.metricName,
    from_value: kr.from,
    to_value: kr.to,
    unit: kr.unit || 'percentage',
    current_value: kr.current ?? null,
    status: kr.status || null,
    function: kr.function || null,
    sort_order: index,
  }));

  const checklistData = (okr.qualityChecklist || []).map(item => ({
    okr_id: okr.id,
    item_id: item.id,
    checked: item.checked,
  }));

  const actionsData = (okr.actions || []).map(action => ({
    id: action.id,
    okr_id: okr.id,
    text: action.text,
    owner: action.owner,
    due_date: action.dueDate,
    completed: action.completed,
    completed_at: action.completedAt || null,
    created_at: action.createdAt,
  }));

  return { okrData, keyResultsData, checklistData, actionsData };
}

// Convert app OKR type to database update format
export function okrToDBUpdate(okr: OKR): {
  okrData: {
    display_id: string | null;
    objective: string;
    parent_id: string | null;
    area: string | null;
    owner: string | null;
    challenges: string | null;
    needs: string | null;
    comments: string | null;
    status: string | null;
  };
} {
  return {
    okrData: {
      display_id: okr.displayId || null,
      objective: okr.objective,
      parent_id: okr.parentId || null,
      area: okr.area || null,
      owner: okr.owner || null,
      challenges: okr.challenges || null,
      needs: okr.needs || null,
      comments: okr.comments || null,
      status: okr.status || null,
    },
  };
}
