import React from 'react';
import { useTheme } from 'react-native-paper';
import SkeletonContent from 'react-native-skeleton-content';

export default function Placeholder({ children, ...props }) {
  const { colors } = useTheme();

  return (
    <SkeletonContent
      boneColor={colors.boneColor}
      highlightColor={colors.highlightBoneColor}
      isLoading
      {...props}
    >
      {children}
    </SkeletonContent>
  );
}
