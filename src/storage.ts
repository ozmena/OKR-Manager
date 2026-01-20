import { OKR } from './types';
import { seedOKRs } from './seedData';

const STORAGE_KEY = 'okrs';

// Sort OKRs by display_id number (OKR-1, OKR-2, etc.)
function sortByDisplayId(okrs: OKR[]): OKR[] {
  return okrs.sort((a, b) => {
    const aNum = a.displayId ? parseInt(a.displayId.replace(/\D/g, ''), 10) || 0 : Infinity;
    const bNum = b.displayId ? parseInt(b.displayId.replace(/\D/g, ''), 10) || 0 : Infinity;
    return aNum - bNum;
  });
}

export function getOKRs(): OKR[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Load seed data when localStorage is empty
    saveOKRs(seedOKRs);
    return sortByDisplayId([...seedOKRs]);
  }
  return sortByDisplayId(JSON.parse(data));
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
