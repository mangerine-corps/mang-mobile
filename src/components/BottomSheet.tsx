import React, { forwardRef, ReactNode } from 'react';
import ActionSheet, {
  ActionSheetProps,
  ActionSheetRef,
} from 'react-native-actions-sheet';
import Box from './Box';
import { ColorProps } from '@shopify/restyle';
import { Theme } from '@/utils/theme';
import { useThemeColors } from '@/hooks/useTheme';
import { Dimensions } from 'react-native';

interface Props {
  noPadding?: boolean;
  children: ReactNode;
  backgroundColor?: ColorProps<Theme>['color'];
  onClose?: () => void;
  sheetProps?: ActionSheetProps;
}

const BottomSheet = forwardRef<ActionSheetRef, Props>((elementProps, ref) => {
  const { children, noPadding, backgroundColor, onClose, sheetProps } =
    elementProps;
  const themeColors = useThemeColors();

  return (
    <ActionSheet
      animated
      onClose={onClose}
      gestureEnabled
      useBottomSafeAreaPadding
      ref={ref}
      containerStyle={{
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        backgroundColor: themeColors[backgroundColor || 'white'],
        maxHeight: Dimensions.get('window').height * 0.75,
      }}
      {...sheetProps}>
      <Box
        backgroundColor={backgroundColor || 'white'}
        paddingHorizontal={!noPadding ? 'l' : undefined}>
        {children}
      </Box>
    </ActionSheet>
  );
});

export default BottomSheet;
