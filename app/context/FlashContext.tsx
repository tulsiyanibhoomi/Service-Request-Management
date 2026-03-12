"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { notify } from "../utils/notify";

interface FlashContextType {
  setFlash: (flash: { message: string; type: string }) => void;
}

const FlashContext = createContext<FlashContextType | undefined>(undefined);

export function FlashProvider({ children }: { children: ReactNode }) {
  const [flash, setFlash] = useState<{ message: string; type: string } | null>(
    null,
  );

  useEffect(() => {
    if (!flash) return;

    if (flash.type === "error") notify.error(flash.message);
    else if (flash.type === "info") notify.info(flash.message);
    else if (flash.type === "warning") notify.warning(flash.message);
    else notify.success(flash.message);

    setFlash(null);
  }, [flash]);

  return (
    <FlashContext.Provider value={{ setFlash }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  const ctx = useContext(FlashContext);
  if (!ctx) throw new Error("useFlash must be used inside FlashProvider");
  return ctx;
}
