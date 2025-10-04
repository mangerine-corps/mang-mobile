import React, { ReactNode } from 'react';
import Modal from './Modal';
import Box from './Box';
import Text from './Text';
import Button from './Button';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  confirm?: () => void;
  title?: string;
  subtitle?: string;
  confirmButton?: string;
  cancelButton?: string;
  headComponent?: ReactNode;
}

const ConfirmModal = ({
  isVisible,
  closeModal,
  title,
  subtitle,
  cancelButton,
  confirmButton,
  confirm,
  headComponent,
}: Props) => {
  return (
    <Modal
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      isVisible={isVisible}>
      <Box flex={1} justifyContent="center">
        <Box>
          <Box
            backgroundColor="background"
            borderRadius={16}
            paddingHorizontal="m"
            paddingVertical="l">
            {headComponent && (
              <Box paddingHorizontal="l" alignItems="center" marginBottom="l">
                {headComponent}
              </Box>
            )}
            <Box paddingHorizontal="m" gap="s" marginBottom="mxl">
              <Text variant="medium" fontSize={20} textAlign="center">
                {title}
              </Text>
              <Text textAlign="center">{subtitle}</Text>
            </Box>
            <Box gap="m">
              <Button
                onPress={closeModal}
                displayText={cancelButton || 'No, Cancel'}
              />
              <Button
                onPress={confirm}
                displayText={confirmButton || 'Yes'}
                buttonProps={{
                  backgroundColor: 'background',
                  borderColor: 'foreground_primary',
                  borderWidth: 1,
                }}
                textProps={{
                  color: 'foreground_primary',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
