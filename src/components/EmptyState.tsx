import {} from 'react-native';
import React from 'react';
import Box from './Box';
import ScaledImage from './ScaledImage';
import Text from './Text';
import Button from './Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';

interface Props {
  subtitle?: string;
  buttonText?: string;
  doSomething?: () => void;
}

const EmptyState = ({ subtitle, doSomething, buttonText }: Props) => {
  const { background } = useThemeColors();

  return (
    <Box alignItems="center" gap="m">
      <ScaledImage
        width={167}
        source={require('@/assets/images/empty-state.png')}
      />
      {subtitle && (
        <Box>
          <Text textAlign="center" fontSize={16}>
            {subtitle}
          </Text>
        </Box>
      )}
      {buttonText && doSomething && (
        <Box width={167}>
          <Button onPress={doSomething}>
            <Box flexDirection="row" alignItems="center" gap="s">
              <MaterialCommunityIcons
                name="plus"
                size={24}
                color={background}
              />
              <Text color="background" variant="bold" fontSize={12}>
                {buttonText}
              </Text>
            </Box>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
