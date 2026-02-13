/**
 * Password Prompt Screen
 * Full-screen modal for password input during account deletion reauthentication
 */

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import {
  BaseModal,
  AtomicInput,
  AtomicButton,
  AtomicText,
  useAppDesignTokens
} from '@umituz/react-native-design-system';

export interface PasswordPromptModalProps {
  visible: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = 'Password Required',
  message = 'Enter your password to continue',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  const tokens = useAppDesignTokens();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    onConfirm(password);
    setPassword('');
    setError('');
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  return (
    <BaseModal
      visible={visible}
      onClose={handleCancel}
      dismissOnBackdrop={false}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.container, { padding: tokens.spacing.xl }]}>
            <View style={styles.header}>
              <AtomicText variant="h2" weight="bold" color="textPrimary" style={styles.title}>
                {title}
              </AtomicText>
              <AtomicText variant="body" color="textSecondary" style={styles.message}>
                {message}
              </AtomicText>
            </View>

            <View style={styles.content}>
              <AtomicInput
                value={password}
                onChangeText={(text: string) => {
                  setPassword(text);
                  setError('');
                }}
                placeholder="Password"
                secureTextEntry
                autoFocus
                state={error ? 'error' : 'default'}
                helperText={error}
                style={{ marginBottom: tokens.spacing.md }}
              />
            </View>

            <View style={[styles.buttons, { gap: tokens.spacing.sm }]}>
              <AtomicButton
                title={cancelText}
                onPress={handleCancel}
                variant="secondary"
                style={styles.button}
              />
              <AtomicButton
                title={confirmText}
                onPress={handleConfirm}
                variant="primary"
                style={styles.button}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
});
