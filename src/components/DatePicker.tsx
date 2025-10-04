import { Theme } from '@/utils/theme';
import { BoxProps, ColorProps } from '@shopify/restyle';
import React, { useState, ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import Box from './Box';
import Text from './Text';
import DP from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';

interface Props {
  label?: string;
  containerProps?: BoxProps<Theme>;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
  error?: string;
  badge?: string;
  backgroundColor?: string;
  disabled?: boolean;
  required?: boolean;
  noPadding?: boolean;
  noMargin?: boolean;
  labelColor?: ColorProps<Theme>['color'];
  borderColor?: ColorProps<Theme>['color'];
  subtext?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  borderRadius?: number | string;
  borderWidth?: number | string;
  height?: any;
}

const DatePicker = ({
  label,
  noMargin,
  containerProps,
  labelColor,
  disabled,
  error,
  borderColor,
  noPadding,
  placeholder: placeholderText,
  value,
  backgroundColor,
  onChange,
  mode = 'date',
  minimumDate,
  required,
  maximumDate,
  borderRadius,
  borderWidth,
  height,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { border, foreground_primary, background } = useThemeColors();

  return (
    <Box marginBottom={!noMargin ? 'm' : undefined} {...containerProps}>
      <DP
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        testID="date-picker-direct"
        modal
        open={open}
        date={value ? new Date(value) : new Date()}
        /* istanbul ignore next */
        onConfirm={date => {
          /* istanbul ignore next */
          setOpen(false);
          /* istanbul ignore next */
          onChange(date.toISOString());
        }}
        /* istanbul ignore next */
        onCancel={() => {
          /* istanbul ignore next */
          setOpen(false);
        }}
        mode={mode}
      />
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
      <TouchableOpacity onPress={() => setOpen(true)}>
        <Box
          // backgroundColor={disabled ? 'muted' : 'background'}
          borderWidth={(borderWidth as any) ?? 1}
          borderRadius={(borderRadius as any) ?? 8}
          borderColor={error ? 'danger' : borderColor || 'border'}
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
          justifyContent="space-between"
          paddingHorizontal={!noPadding ? 'm' : undefined}
          alignItems="center">
          <Text variant="medium">
            {value
              ? new Date(value).toLocaleDateString('en-US')
              : placeholderText}
          </Text>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={18}
            color={foreground_primary}
          />
        </Box>
      </TouchableOpacity>
      {error && (
        <Text variant="medium" fontSize={10} color="danger" marginTop="xs">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default DatePicker;
