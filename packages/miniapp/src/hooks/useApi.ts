'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';

export function useDashboard(telegramId?: string | null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!telegramId) { setLoading(false); return; }
    try {
      setLoading(true);
      const result = await apiClient.get(`/analytics/dashboard/${telegramId}`);
      if (result.success) setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}

export function useAnalytics(telegramId?: string | null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!telegramId) { setLoading(false); return; }
    try {
      setLoading(true);
      const result = await apiClient.get(`/analytics/${telegramId}`);
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return { data, loading, refetch: fetchAnalytics };
}

export function useTransactions(telegramId?: string | null, params?: Record<string, string>) {
  const [data, setData] = useState<any>({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!telegramId) { setLoading(false); return; }
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const result = await apiClient.get(`/transactions/${telegramId}?${query}`);
      if (result.success) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [telegramId, JSON.stringify(params || {})]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  return { data, loading, refetch: fetchTransactions };
}
