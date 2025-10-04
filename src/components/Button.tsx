import { Theme } from '@/utils/theme';
import { BoxProps, TextProps, useTheme } from '@shopify/restyle';
import React, { ReactNode } from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Circle } from 'react-native-animated-spinkit';
import Box from './Box';
import Text from './Text';

interface Props {
  containerProps?: BoxProps<Theme>;
  onPress?: () => void;
  buttonProps?: BoxProps<Theme>;
  displayText?: string;
  children?: ReactNode;
  loading?: boolean;
  style?: ViewStyle;
  textProps?: TextProps<Theme>;
  disabled?: boolean;
  testID?: string;
}

const Button = ({
  containerProps,
  onPress,
  buttonProps,
  displayText,
  children,
  loading,
  style,
  textProps,
  disabled,
  testID,
}: Props) => {
  const theme = useTheme<Theme>();

  return (
    <Box width="100%" {...containerProps}>
      <TouchableOpacity
        activeOpacity={0.91}
        testID={testID || 'app-button'}
        disabled={disabled || loading}
        onPress={onPress}>
        <Box
          height={52}
          // shadowColor="foreground"
          // shadowOffset={{
          //   width: 0,
          //   height: 4,
          // }}
          opacity={disabled ? 0.4 : undefined}
          // shadowOpacity={0.1}
          // shadowRadius={4}
          // elevation={4}
          backgroundColor="button_primary"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderRadius={8}
          {...buttonProps}
          style={{ ...style }}>
          {loading && (
            <Circle
              color={
                theme.colors[textProps?.color || 'background'] ||
                theme.colors.background
              }
              style={{ marginRight: 5 }}
              size={16}
            />
          )}
          {displayText && (
            <Text
              variant="semibold"
              color="background"
              fontSize={16}
              {...textProps}>
              {displayText}
            </Text>
          )}
          {children}
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default Button;
