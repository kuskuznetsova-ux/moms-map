import { useState } from 'react';

const KEY = 'moms-map:profile:v1';

export interface Profile {
  name: string;
  consentAt: string; // ISO: когда согласилась
}

function read(): Profile | null {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Profile | null;
    return p && p.name && p.consentAt ? p : null;
  } catch {
    return null;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(read);
  const save = (p: Profile | null) => {
    try {
      if (p) localStorage.setItem(KEY, JSON.stringify(p));
      else localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setProfile(p);
  };
  return [profile, save] as const;
}
