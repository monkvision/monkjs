import { CSSProperties } from 'react';
import { styles } from './Content.styles';

interface ContentProps {
  style?: CSSProperties;
  children: string | JSX.Element | JSX.Element[];
}

/**
 * Wrapper component which is a Basic content style component. It can take additional style to the default one as props.
 */
export function Content({ children, style }: ContentProps) {
  return <div style={{ ...styles['content'], ...style }}>{children}</div>;
}
