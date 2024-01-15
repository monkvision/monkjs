import { styles } from './Title.styles';

export function Title({ children }: { children: string }) {
  return <div style={styles['smallText']}>{children}</div>;
}
