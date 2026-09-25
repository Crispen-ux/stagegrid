"use client";

import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { equipment } from "@/data/equipment";
import type { Equipment } from "@/types";

export interface BasketLine {
  equipmentId: string;
  quantity: number;
}

interface BasketState {
  lines: BasketLine[];
  hydrated: boolean;
}

type Action =
  | { type: "ADD"; equipmentId: string; quantity: number }
  | { type: "SET_QTY"; equipmentId: string; quantity: number }
  | { type: "REMOVE"; equipmentId: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; lines: BasketLine[] };

function reducer(state: BasketState, action: Action): BasketState {
  switch (action.type) {
    case "HYDRATE":
      return { lines: action.lines, hydrated: true };
    case "ADD": {
      const existing = state.lines.find((l) => l.equipmentId === action.equipmentId);
      const lines = existing
        ? state.lines.map((l) =>
            l.equipmentId === action.equipmentId ? { ...l, quantity: l.quantity + action.quantity } : l
          )
        : [...state.lines, { equipmentId: action.equipmentId, quantity: action.quantity }];
      return { ...state, lines };
    }
    case "SET_QTY": {
      if (action.quantity <= 0) {
        return { ...state, lines: state.lines.filter((l) => l.equipmentId !== action.equipmentId) };
      }
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.equipmentId === action.equipmentId ? { ...l, quantity: action.quantity } : l
        ),
      };
    }
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.equipmentId !== action.equipmentId) };
    case "CLEAR":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "stagegrid.basket.v1";

interface BasketContextValue {
  lines: (BasketLine & { equipment: Equipment; lineTotal: number })[];
  itemCount: number;
  total: number;
  addToEvent: (equipmentId: string, quantity?: number) => void;
  setQuantity: (equipmentId: string, quantity: number) => void;
  remove: (equipmentId: string) => void;
  clear: () => void;
}

const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      dispatch({ type: "HYDRATE", lines: raw ? JSON.parse(raw) : [] });
    } catch {
      dispatch({ type: "HYDRATE", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // storage unavailable — basket still works for this session
    }
  }, [state.lines, state.hydrated]);

  const value = useMemo<BasketContextValue>(() => {
    const lines = state.lines
      .map((l) => {
        const item = equipment.find((e) => e.id === l.equipmentId);
        if (!item) return null;
        return { ...l, equipment: item, lineTotal: item.dailyRate * l.quantity };
      })
      .filter((l): l is BasketLine & { equipment: Equipment; lineTotal: number } => l !== null);

    return {
      lines,
      itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
      total: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      addToEvent: (equipmentId, quantity = 1) => dispatch({ type: "ADD", equipmentId, quantity }),
      setQuantity: (equipmentId, quantity) => dispatch({ type: "SET_QTY", equipmentId, quantity }),
      remove: (equipmentId) => dispatch({ type: "REMOVE", equipmentId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.lines]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useBasket must be used within a BasketProvider");
  return ctx;
}
