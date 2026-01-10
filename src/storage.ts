import { OKR } from './types';

const STORAGE_KEY = 'okrs';

export function getOKRs(): OKR[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function saveOKRs(okrs: OKR[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(okrs));
}

export function addOKR(okr: OKR): void {
  const okrs = getOKRs();
  okrs.push(okr);
  saveOKRs(okrs);
}

export function deleteOKR(id: string): void {
  const okrs = getOKRs();
  const idsToDelete = new Set<string>();

  function collectDescendants(parentId: string) {
    idsToDelete.add(parentId);
    okrs.filter(okr => okr.parentId === parentId).forEach(child => {
      collectDescendants(child.id);
    });
  }

  collectDescendants(id);
  const filtered = okrs.filter(okr => !idsToDelete.has(okr.id));
  saveOKRs(filtered);
}

export function updateOKR(updatedOKR: OKR): void {
  const okrs = getOKRs();
  const index = okrs.findIndex(okr => okr.id === updatedOKR.id);
  if (index !== -1) {
    okrs[index] = updatedOKR;
    saveOKRs(okrs);
  }
}
