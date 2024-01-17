import { styles } from './Title.styles';

interface TitleProps {
  children: string;
}

/**
 * Wrapper component which is a Title style component. It can take additional style to the default one as props.
 */
export function Title({ children }: TitleProps) {
  return <div style={styles['title']}>{children}</div>;
}
