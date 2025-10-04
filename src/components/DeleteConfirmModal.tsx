import React from 'react';
import Modal from './Modal';
import Box from './Box';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from './Text';
import Button from './Button';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  confirmDelete?: () => void;
  title?: string;
  subtitle?: string;
}

const DeleteConfirmModal = ({
  isVisible,
  closeModal,
  title,
  subtitle,
  confirmDelete,
}: Props) => {
  const { danger } = useThemeColors();

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
            <Box alignItems="center">
              <Box
                height={80}
                width={80}
                borderRadius={80}
                backgroundColor="faded_danger"
                justifyContent="center"
                alignItems="center">
                <MaterialCommunityIcons
                  name="trash-can"
                  size={48}
                  color={danger}
                />
              </Box>
            </Box>
            <Box paddingHorizontal="m" gap="s" marginBottom="mxl">
              <Text variant="medium" fontSize={20} textAlign="center">
                {title}
              </Text>
              <Text textAlign="center">{subtitle}</Text>
            </Box>
            <Box gap="m">
              <Button
                onPress={confirmDelete}
                displayText="Yes, Delete"
                buttonProps={{
                  backgroundColor: 'danger',
                }}
              />
              <Button
                onPress={closeModal}
                displayText="No, Keep"
                buttonProps={{
                  backgroundColor: 'background',
                  borderColor: 'label',
                  borderWidth: 1,
                }}
                textProps={{
                  color: 'label',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmModal;
