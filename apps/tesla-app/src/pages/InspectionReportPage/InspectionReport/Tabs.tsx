import { changeAlpha, useMonkTheme } from '@monkvision/common';
import { Icon } from '@monkvision/common-ui-web';

const styles = {
  container: {
    // width: '300px',
    margin: 'auto',
    textAlign: 'center' as const,
    fontFamily: 'Arial, sans-serif',
  },
  tabsHeader: {
    display: 'flex',
    marginBottom: '20px',
    justifyContent: 'center',
  },
  tabButton: {
    padding: '10px 20px',
    border: 'solid rgba(1, 1, 1, .2)',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonLeft: {
    width: '200px',
    borderWidth: '1px 0px 1px 1px',
    borderRadius: '99px 0px 0px 99px',
  },
  tabButtonRight: {
    width: '200px',
    borderWidth: '1px 1px 1px 0px',
    borderRadius: '0px 99px 99px 0px',
  },
  tabContent: {
    padding: '20px',
    backgroundColor: '#f1f1f1',
    borderRadius: '5px',
  },
  icon: {
    height: '20px',
  },
};

export enum TabMode {
  INTERIOR = 'interior',
  EXTERIOR = 'exterior',
}

export interface TabsComponentProps {
  mode: TabMode;
  onClick?: (mode: TabMode) => void;
}

export function TabsComponent({ mode = TabMode.EXTERIOR, onClick = () => {} }: TabsComponentProps) {
  const { palette } = useMonkTheme();

  return (
    <div style={styles.container}>
      <div style={styles.tabsHeader}>
        <button
          onClick={() => onClick(TabMode.EXTERIOR)}
          style={{
            ...styles.tabButton,
            ...styles.tabButtonLeft,
            backgroundColor:
              mode === TabMode.EXTERIOR ? changeAlpha(palette.background.light, 0.2) : '',
            // color: mode === TabMode.EXTERIOR ? '#fff' : '#000',
          }}
        >
          {mode === TabMode.EXTERIOR && <Icon style={styles.icon} icon='check' />}
          Exterior
        </button>
        <button
          onClick={() => onClick(TabMode.INTERIOR)}
          style={{
            ...styles.tabButton,
            ...styles.tabButtonRight,
            backgroundColor:
              mode === TabMode.INTERIOR ? changeAlpha(palette.background.light, 0.2) : '',
            // color: mode === TabMode.INTERIOR ? '#fff' : '#000',
          }}
        >
          {mode === TabMode.INTERIOR && <Icon style={styles.icon} icon='check' />}
          Interior/Tire
        </button>
      </div>
    </div>
  );
}
