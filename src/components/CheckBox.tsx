import React from 'react';
import { TouchableOpacity } from 'react-native';
import Box from './Box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeColors } from '@/hooks/useTheme';

interface Props {
  color?: string;
  checkColor?: string;
  size?: number;
  onPress?: () => void;
  checked?: boolean;
}

const CheckBox = ({ checked, onPress, size, color, checkColor }: Props) => {
  const { foreground_primary, background } = useThemeColors();

  return (
    <Box>
      <TouchableOpacity
        activeOpacity={0.91}
        testID="checkbox"
        onPress={onPress}>
        <Box
          borderRadius={5}
          borderWidth={1}
          justifyContent="center"
          alignItems="center"
          style={{
            borderColor: color || foreground_primary,
            backgroundColor: checked ? color || foreground_primary : undefined,
            width: size,
            height: size,
          }}>
          {checked && (
            <Ionicons
              name={'checkmark'}
              size={(size || 14) - 6}
              color={checked ? checkColor || background : foreground_primary}
            />
          )}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default CheckBox;
