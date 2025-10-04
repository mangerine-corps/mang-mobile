import React, { useEffect, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import Box from './Box';
import { useThemeColors } from '@/hooks/useTheme';

interface Props {
  color?: string;
  size?: number;
  onPress?: () => void;
  value?: boolean;
}

const Switch = ({ value, onPress, size = 24, color }: Props) => {
  const { foreground_primary, label } = useThemeColors();
  const originalHeight = 24;
  const scale = (size || originalHeight) / originalHeight;
  const [animatedWidth] = useState(new Animated.Value(16));

  useEffect(() => {
    if (value) {
      Animated.timing(animatedWidth, {
        toValue: 40,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedWidth, {
        toValue: 16,
        duration: 225,
        useNativeDriver: false,
      }).start();
    }
  }, [value, animatedWidth]);

  return (
    <Box
      style={{
        transform: [
          {
            scale,
          },
        ],
      }}>
      <TouchableOpacity activeOpacity={0.91} testID="switch" onPress={onPress}>
        <Box
          width={50}
          paddingHorizontal="xs"
          height={originalHeight}
          justifyContent="center"
          borderWidth={1.5}
          borderRadius={100}
          style={{
            borderColor: value ? color || foreground_primary : label,
          }}>
          <Box>
            <Animated.View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width: animatedWidth,
              }}>
              <Box
                width={16}
                height={16}
                borderRadius={16}
                style={{
                  backgroundColor: value ? color || foreground_primary : label,
                }}></Box>
            </Animated.View>
          </Box>
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default Switch;
