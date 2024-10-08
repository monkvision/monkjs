import { useColorMode } from '@docusaurus/theme-common';
import React, { forwardRef, useMemo, useState } from 'react';
import { Icon } from '../../domOnly';
import styles from './SearchBar.module.css';

export interface SearchBarProps {
  onInput: (value: string) => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar(
  { onInput },
  ref,
) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const isDarkTheme = useColorMode().colorMode === 'dark';
  const inputColor = useMemo(() => {
    if (isInputFocused) {
      return '#3261cd';
    }
    return isDarkTheme ? '#ffffff' : '#000000';
  }, [isInputFocused, isDarkTheme]);
  return (
    <div
      className={styles['input-container']}
      onFocus={() => setIsInputFocused(true)}
      onBlur={() => setIsInputFocused(false)}
    >
      <Icon icon='search' size={30} primaryColor={inputColor} />
      <input
        ref={ref}
        onChange={(e) => onInput(e.target.value)}
        style={{ borderColor: inputColor }}
      />
    </div>
  );
});
