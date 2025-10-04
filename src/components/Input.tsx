import { Theme } from '@/utils/theme';
import { BoxProps, ColorProps } from '@shopify/restyle';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  Animated,
} from 'react-native';
import Box from './Box';
import Text from './Text';
import {
  useThemeColors,
  useThemeSpacing,
  useThemeText,
} from '@/hooks/useTheme';

interface Props extends TextInputProps {
  label?: string;
  containerProps?: BoxProps<Theme>;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  error?: string;
  badge?: string;
  dud?: boolean;
  disabled?: boolean;
  required?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  labelColor?: ColorProps<Theme>['color'];
  borderColor?: ColorProps<Theme>['color'];
  subtext?: string;
  backgroundColor?: string;
  inputStyle?: StyleProp<TextStyle>;
  borderRadius?: number | string;
  borderWidth?: number | string;
  height?: any;
}

const Input = ({
  label,
  containerProps,
  leftComponent,
  rightComponent,
  error,
  badge,
  labelColor,
  borderColor,
  disabled,
  subtext,
  noPadding,
  noMargin,
  backgroundColor,
  borderRadius,
  dud,
  borderWidth,
  inputStyle,
  required,
  height,
  ...props
}: Props) => {
  const { foreground, placeholder, border, background } = useThemeColors();
  const { m } = useThemeSpacing();
  const [focused, setFocused] = useState(false);
  const { medium } = useThemeText();
  const [shakeAnimation] = useState(new Animated.Value(0));

  const startShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

  useEffect(() => {
    if (error) {
      startShake();
    }
  }, [error, startShake]);

  return (
    <Box marginBottom={!noMargin ? 'm' : undefined} {...containerProps}>
      {label && (
        <Text fontSize={12} color={labelColor || 'label'} marginBottom="s">
          {label}
          {required && (
            <Text fontSize={12} color="danger">
              *
            </Text>
          )}
        </Text>
      )}
      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <Box
          // backgroundColor={disabled ? 'muted' : 'background'}
          borderWidth={(borderWidth as any) ?? 1}
          borderRadius={(borderRadius as any) ?? 8}
          borderColor={
            error
              ? 'danger'
              : focused
              ? 'foreground_primary'
              : borderColor || 'border'
          }
          height={height ?? 50}
          style={{
            backgroundColor: backgroundColor
              ? backgroundColor
              : disabled
              ? border
              : background,
          }}
          overflow="hidden"
          flexDirection="row"
          paddingHorizontal={!noPadding ? 'm' : undefined}
          position="relative"
          alignItems="center">
          {leftComponent}
          {badge && (
            <Box
              style={{
                height: '100%',
                borderWidth: 1,
                borderColor: border,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                backgroundColor: background,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 0,
                paddingHorizontal: m,
                marginLeft: -m,
                marginRight: m,
              }}>
              <Text variant="medium" fontSize={12}>
                {badge}
              </Text>
            </Box>
          )}
          <TextInput
            testID="input"
            placeholderTextColor={placeholder}
            editable={
              dud !== undefined
                ? !dud
                : disabled !== undefined
                ? !disabled
                : undefined
            }
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1,
              height: '100%',
              fontFamily: medium.fontFamily,
              color: foreground,
              fontSize: 16,
              ...(inputStyle || ({} as any)),
            }}
            {...props}
          />
          {rightComponent}
        </Box>
      </Animated.View>
      {(error || subtext) && (
        <Box
          // flexDirection="row"
          // alignItems="center"
          marginTop="xs"
          justifyContent="space-between">
          <Box>
            {error && (
              <Text variant="medium" fontSize={10} color="danger">
                {error}
              </Text>
            )}
          </Box>
          <Box>
            <Text color="label" fontSize={12}>
              {subtext}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Input;
