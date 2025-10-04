import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import Modal from './Modal';
import Box from './Box';
import Text from './Text';
import Button from './Button';
import ScaledImage from './ScaledImage';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  title: string;
  subtitle?: string;
  buttonText?: string;
}

const SuccessModal = ({
  isVisible,
  closeModal,
  title,
  subtitle,
  buttonText,
}: Props) => {
  return (
    <Modal
      style={{ margin: 0 }}
      onBackButtonPress={closeModal}
      isVisible={isVisible}>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1} backgroundColor="background" paddingVertical="xxl">
            <Box alignItems="center" marginBottom="xl">
              <ScaledImage
                height={115}
                source={require('@/assets/images/success-check.png')}
              />
            </Box>
            <Box paddingHorizontal="mid">
              <Box gap="s">
                <Text variant="semibold" fontSize={24} textAlign="center">
                  {title}
                </Text>
                {subtitle && (
                  <Text textAlign="center" fontSize={20}>
                    {subtitle}
                  </Text>
                )}
              </Box>
              <Box marginTop="30" paddingHorizontal="mid">
                <Button
                  onPress={closeModal}
                  displayText={buttonText || 'Continue'}
                />
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </Modal>
  );
};

export default SuccessModal;
