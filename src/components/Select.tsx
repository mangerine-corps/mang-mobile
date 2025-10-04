import React, { useMemo, useState } from 'react';
import Box from './Box';
import SelectDropdown from 'react-native-select-dropdown-customized';
import { ColorProps } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import Feather from 'react-native-vector-icons/Feather';
import Text from './Text';
import { addAlpha } from '@/utils/helpers';
import {
  useThemeColors,
  useThemeSpacing,
  useThemeText,
} from '@/hooks/useTheme';

interface Props {
  data: { title: string; value: any }[];
  onSelect?: (value: any) => void;
  title?: string;
  error?: string;
  defaultValue?: string;
  value: string;
  height?: any;
  disabled?: boolean;
  required?: boolean;
  noMargin?: boolean;
  search?: boolean;
  labelColor?: ColorProps<Theme>['color'];
  borderColor?: string;
  backgroundColor?: string;
  label?: string;
  arrayUpdate?: (value: any) => void;
  multiple?: boolean;
  arrayValues?: any[];
}

interface MultipleProps {
  arrayUpdate: (value: any) => void;
  multiple: boolean;
  arrayValues: any[];
}

const Select = ({
  data = [],
  onSelect,
  label,
  height,
  error,
  labelColor,
  borderColor,
  backgroundColor,
  title,
  defaultValue,
  disabled,
  search,
  required,
  noMargin,
  value,
  ...restProps
}: Props | (MultipleProps & Props)) => {
  const { background, placeholder, foreground, border } = useThemeColors();
  const { m } = useThemeSpacing();
  const { medium, regular } = useThemeText();
  const {
    arrayUpdate = (_value: any) => {},
    multiple = false,
    arrayValues = [],
  } = useMemo(() => restProps, [restProps]);
  const [localValue, setlocalValue] = useState(value || '');

  return (
    <Box marginBottom={noMargin ? undefined : 'l'} testID="magic-tap-test">
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
      <SelectDropdown
        search={search}
        data={data}
        disabled={disabled}
        /* istanbul ignore next */
        defaultValue={defaultValue}
        /* istanbul ignore next */
        onSelect={(selectedItem: (typeof data)[0]) => {
          // console.log(selectedItem, index);
          /* istanbul ignore next */
          if (onSelect) {
            if (multiple) {
              const exists = (arrayValues || []).includes(selectedItem.value);
              if (exists) {
                const filteredValues = (arrayValues || []).filter(
                  x => x !== selectedItem.value,
                );
                const actives = filteredValues.join(',');
                const finalActive =
                  actives[0] === ',' ? actives.substring(1) : actives;
                arrayUpdate(filteredValues);
                onSelect(finalActive);
              } else {
                const newActives = [...(arrayValues || []), selectedItem.value];
                arrayUpdate(newActives);
                const actives = newActives.join(',');
                const finalActive =
                  actives[0] === ',' ? actives.substring(1) : actives;
                onSelect(finalActive);
              }
            } else {
              onSelect(selectedItem.value);
              setlocalValue(selectedItem?.value);
            }
          }
        }}
        searchInputStyle={{
          height: 50,
          backgroundColor: backgroundColor
            ? backgroundColor
            : disabled
            ? background
            : background,
          borderRadius: 12,
          overflow: 'hidden',
        }}
        searchPlaceHolder="Search"
        renderEmptyCustomizedRowChild={() => (
          <Box alignItems="center">
            <Text textAlign="center" color="placeholder">
              No results found
            </Text>
          </Box>
        )}
        renderCustomizedButtonChild={() => (
          <Box paddingHorizontal="s">
            <Text
              fontSize={16}
              variant="medium"
              color={!(value || localValue) ? 'placeholder' : 'foreground'}>
              {data.find(x => x.value === (localValue || title || value))
                ?.title ||
                localValue ||
                title ||
                value ||
                'Select'}
            </Text>
          </Box>
        )}
        searchInputTxtColor={placeholder}
        searchPlaceHolderColor={placeholder}
        searchInputTxtStyle={{
          fontSize: 14,
          fontFamily: medium.fontFamily,
          color: placeholder,
        }}
        renderSearchInputLeftIcon={() => (
          <Feather name="search" color={placeholder} size={14} />
        )}
        defaultButtonText={title}
        /* istanbul ignore next */
        buttonTextAfterSelection={selectedItem => {
          // text represented after item is selected
          // if data array is an array of objects then return selectedItem.property to render after item is selected
          /* istanbul ignore next */
          return selectedItem.title;
        }}
        /* istanbul ignore next */
        rowTextForSelection={item => {
          // text represented for each item in dropdown
          // if data array is an array of objects then return item.property to represent item in dropdown
          /* istanbul ignore next */
          return item.title;
        }}
        dropdownOverlayColor="transparent"
        buttonStyle={{
          height: height || 50,
          borderWidth: 1,
          borderColor: error ? 'danger' : borderColor || border,
          padding: m,
          borderRadius: 12,
          backgroundColor: backgroundColor
            ? backgroundColor
            : disabled
            ? background
            : background,
          flexDirection: 'row-reverse',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: 0,
          width: '100%',
        }}
        buttonTextStyle={{
          fontSize: 16,
          color: placeholder,
          fontFamily: medium.fontFamily,
          textAlign: 'left',
        }}
        rowTextStyle={{
          fontSize: 14,
          color: placeholder,
          fontFamily: regular.fontFamily,
          textAlign: 'left',
          paddingVertical: 8,
        }}
        rowStyle={{
          backgroundColor: background,
          // paddingVertical: s,
          borderBottomWidth: 0,
          height: 37,
          borderRadius: 8,
          marginBottom: 8,
          paddingHorizontal: m,
          // paddingVertical: 8,
        }}
        dropdownIconPosition="right"
        dropdownStyle={{
          borderRadius: 8,
          shadowColor: foreground,
          shadowOffset: {
            height: 4,
            width: 0,
          },
          borderWidth: 1,
          shadowOpacity: 0.7,
          shadowRadius: 5,
          elevation: 2,
          borderColor: addAlpha(foreground, 0.2),
          backgroundColor: background,
          minHeight: 100,
          // overflow: 'hidden',
        }}
        renderDropdownIcon={() => (
          <Feather name="chevron-down" size={14} color={placeholder} />
        )}
      />
      {error && (
        <Text variant="medium" fontSize={10} color="danger" marginTop="xs">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default Select;
