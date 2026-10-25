import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Language, Lesson, Length, Level } from "./lesson";

export type Prefs = { level: Level; length: Length; language: Language };
const DEFAULT_PREFS: Prefs = { level: "Beginner", length: "Balanced", language: "English" };
const PREFS_KEY = "aiea.prefs.v1";
const LIB_KEY = "aiea.library.v1";

export function readLibrary(): Lesson[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(LIB_KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function writeLibrary(l: Lesson[]) {
  localStorage.setItem(LIB_KEY, JSON.stringify(l));
}

type Ctx = {
  prefs: Prefs;
  setPrefs: (p: Partial<Prefs>) => void;
  current: Lesson | null;
  setCurrent: (l: Lesson | null) => void;
  sessionKey: number;
  newSession: () => void;
  library: Lesson[];
  saveLesson: (l: Lesson) => void;
  removeLesson: (id: string) => void;
  isSaved: (id: string) => boolean;
  geminiVerified: boolean;
  markVerified: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [current, setCurrent] = useState<Lesson | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [library, setLibrary] = useState<Lesson[]>([]);
  const [geminiVerified, setVerified] = useState(false);

  useEffect(() => {
    setLibrary(readLibrary());
    try {
      const p = JSON.parse(localStorage.getItem(PREFS_KEY) || "null");
      if (p) setPrefsState({ ...DEFAULT_PREFS, ...p });
    } catch {
      /* ignore */
    }
  }, []);

  const setPrefs = useCallback((p: Partial<Prefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const saveLesson = useCallback((l: Lesson) => {
    setLibrary((prev) => {
      const next = [l, ...prev.filter((x) => x.id !== l.id)];
      writeLibrary(next);
      return next;
    });
  }, []);
  const removeLesson = useCallback((id: string) => {
    setLibrary((prev) => {
      const next = prev.filter((x) => x.id !== id);
      writeLibrary(next);
      return next;
    });
  }, []);

  return (
    <AppCtx.Provider
      value={{
        prefs,
        setPrefs,
        current,
        setCurrent,
        sessionKey,
        newSession: () => {
          setCurrent(null);
          setSessionKey((k) => k + 1);
        },
        library,
        saveLesson,
        removeLesson,
        isSaved: (id) => library.some((l) => l.id === id),
        geminiVerified,
        markVerified: () => setVerified(true),
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}
