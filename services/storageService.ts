import { QuoteData } from '../types';

const STORAGE_KEY = 'TWL_DB_V1';

export const saveQuote = (quote: QuoteData): void => {
  const existing = getQuotes();
  const updated = [quote, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getQuotes = (): QuoteData[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse DB", e);
    return [];
  }
};

export const updateQuoteStatus = (id: string, status: QuoteData['status']): void => {
  const quotes = getQuotes();
  const updated = quotes.map(q => q.id === id ? { ...q, status } : q);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearAllData = (): void => {
    localStorage.removeItem(STORAGE_KEY);
}