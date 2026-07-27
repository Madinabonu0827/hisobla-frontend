'use client';

import { useEffect, useState, useCallback } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat_instance?: string;
    chat_type?: string;
    start_param?: string;
    can_read_messages?: boolean;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  ready(): void;
  expand(): void;
  close(): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'ok' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'success' | 'warning' | 'error'): void;
    selectionChanged(): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  BackButton: {
    isVisible: boolean;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
  };
  CloudStorage: {
    setItem(key: string, value: string, callback?: (err: Error | null, stored: boolean) => void): void;
    getItem(key: string, callback?: (err: Error | null, value: string | null) => void): void;
    getItems(keys: string[], callback?: (err: Error | null, values: Record<string, string>) => void): void;
    removeItem(key: string, callback?: (err: Error | null, removed: boolean) => void): void;
    removeItems(keys: string[], callback?: (err: Error | null, removed: boolean) => void): void;
    clear(callback?: (err: Error | null, cleared: boolean) => void): void;
    getKeys(callback?: (err: Error | null, keys: string[]) => void): void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram?.WebApp;
    if (!tg) {
      // Fallback for development outside Telegram
      console.warn('Telegram WebApp not available, using dev mode');
      setUser({
        id: 7443313693,
        first_name: 'Dev User',
        username: 'dev_user',
        language_code: 'uz',
      });
      setIsReady(true);
      return;
    }

    tg.ready();
    tg.expand();

    setWebApp(tg);
    setUser(tg.initDataUnsafe?.user || null);
    setIsReady(true);

    // Apply theme
    document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor || '#0a0a1a');
    document.documentElement.style.setProperty('--tg-theme-text-color', '#ffffff');
    document.documentElement.style.setProperty('--tg-theme-button-color', '#00d68f');
    document.documentElement.style.setProperty('--tg-theme-button-text-color', '#ffffff');
  }, []);

  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  const openLink = useCallback((url: string) => {
    webApp?.openLink(url);
  }, [webApp]);

  const hapticFeedback = useCallback((type: 'impact' | 'notification' | 'selection', style?: string) => {
    if (!webApp?.HapticFeedback) return;
    if (type === 'impact') {
      webApp.HapticFeedback.impactOccurred((style as any) || 'medium');
    } else if (type === 'notification') {
      webApp.HapticFeedback.notificationOccurred((style as any) || 'success');
    } else {
      webApp.HapticFeedback.selectionChanged();
    }
  }, [webApp]);

  const showAlert = useCallback((message: string) => {
    return new Promise<void>((resolve) => {
      webApp?.showAlert(message, () => resolve());
    });
  }, [webApp]);

  const showConfirm = useCallback((message: string) => {
    return new Promise<boolean>((resolve) => {
      webApp?.showConfirm(message, (confirmed) => resolve(confirmed));
    });
  }, [webApp]);

  return {
    isReady,
    user,
    webApp,
    initData: webApp?.initData || '',
    close,
    openLink,
    hapticFeedback,
    showAlert,
    showConfirm,
  };
}
