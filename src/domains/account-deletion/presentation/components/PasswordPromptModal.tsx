/**
 * Password Prompt Modal
 * Modal for password input during account deletion reauthentication
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  BaseModal,
  AtomicInput,
  AtomicButton,
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
      title={title}
      subtitle={message}
      dismissOnBackdrop={false}
    >
      <View style={[styles.container, { padding: tokens.spacing.md }]}>
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
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
  },
});
