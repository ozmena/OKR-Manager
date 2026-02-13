import { OKR } from './types';
import { seedOKRs } from './seedData';

const STORAGE_KEY = 'okrs';
const VERSION_KEY = 'okrs_version';
const DATA_VERSION = 4;

// Sort: global OKRs by displayId number, children by createdAt
function sortByDisplayId(okrs: OKR[]): OKR[] {
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

export function getOKRs(): OKR[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Load seed data when localStorage is empty
    saveOKRs(seedOKRs);
    return sortByDisplayId([...seedOKRs]);
  }
  const okrs: OKR[] = JSON.parse(data);
  okrs.forEach(okr => {
    if (okr.status && !['on-track', 'progressing', 'off-track'].includes(okr.status)) {
      okr.status = undefined;
    }
  });
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10);
  if (storedVersion < DATA_VERSION) {
    const seedMap = new Map(seedOKRs.map(s => [s.id, s]));
    okrs.forEach(okr => {
      const seed = seedMap.get(okr.id);
      if (seed && okr.status === undefined && seed.status) {
        okr.status = seed.status;
      }
    });
    saveOKRs(okrs);
    localStorage.setItem(VERSION_KEY, String(DATA_VERSION));
  }
  return sortByDisplayId(okrs);
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
