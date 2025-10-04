import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import { useMemo } from 'react';

export const useThemeColors = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.colors,
    }),
    [theme],
  );
};

export const useThemeSpacing = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.spacing,
    }),
    [theme],
  );
};

export const useThemeText = () => {
  const theme = useTheme<Theme>();

  return useMemo(
    () => ({
      ...theme.textVariants,
    }),
    [theme],
  );
};
