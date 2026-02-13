/**
 * Password Prompt Hook
 * Manages password prompt modal state and logic
 */

import React, { useState, useCallback, useMemo } from 'react';
import { PasswordPromptScreen } from '../components/PasswordPromptScreen';

export interface UsePasswordPromptOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface UsePasswordPromptReturn {
  showPasswordPrompt: () => Promise<string | null>;
  PasswordPromptComponent: React.ReactNode;
}

export const usePasswordPrompt = (options: UsePasswordPromptOptions = {}): UsePasswordPromptReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<((value: string | null) => void) | null>(null);

  const showPasswordPrompt = useCallback((): Promise<string | null> => {
    console.log("[usePasswordPrompt] showPasswordPrompt called - opening modal");
    return new Promise((resolve) => {
      setResolvePromise(() => resolve);
      setIsVisible(true);
      console.log("[usePasswordPrompt] Modal visibility set to true");
    });
  }, []);

  const handleConfirm = useCallback((password: string) => {
    if (resolvePromise) {
      resolvePromise(password);
    }
    setIsVisible(false);
    setResolvePromise(null);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(null);
    }
    setIsVisible(false);
    setResolvePromise(null);
  }, [resolvePromise]);

  const PasswordPromptComponent = useMemo(() => (
    <PasswordPromptScreen
      visible={isVisible}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      title={options.title}
      message={options.message}
      confirmText={options.confirmText}
      cancelText={options.cancelText}
    />
  ), [isVisible, handleConfirm, handleCancel, options.title, options.message, options.confirmText, options.cancelText]);

  return {
    showPasswordPrompt,
    PasswordPromptComponent,
  };
};
