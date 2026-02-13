/**
 * Password Prompt Screen
 * Full-screen modal for password input during account deletion reauthentication
 */

import React, { useState } from 'react';
import { View, StyleSheet, Modal, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AtomicInput,
  AtomicButton,
  AtomicText,
  AtomicIcon,
  useAppDesignTokens
} from '@umituz/react-native-design-system';

export interface PasswordPromptScreenProps {
  visible: boolean;
  onConfirm: (password: string) => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const PasswordPromptScreen: React.FC<PasswordPromptScreenProps> = ({
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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: tokens.colors.background }]} edges={['top', 'bottom']}>
        <View style={[styles.headerBar, { borderBottomColor: tokens.colors.border }]}>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <AtomicIcon name="close" size="lg" color="textSecondary" />
          </TouchableOpacity>
          <AtomicText variant="h3" weight="semibold" color="textPrimary">
            {title}
          </AtomicText>
          <View style={styles.placeholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.container, { padding: tokens.spacing.xl }]}>
            <View style={styles.messageContainer}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
    width: 40,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
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
