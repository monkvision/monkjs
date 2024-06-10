import { Styles } from '@monkvision/types';

export const styles: Styles = {
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  mainContainerDisabled: {
    opacity: 0.37,
    cursor: 'default',
  },
  componentsContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 4,
    borderStyle: 'solid',
    minHeight: 53,
    boxSizing: 'border-box',
    borderRadius: '4px 4px 0 0',
  },
  icon: {
    marginRight: 16,
    transform: 'translateY(-4px)',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    left: 0,
    bottom: 12,
    fontSize: 16,
    fontWeight: 500,
    transition: 'all 0.2s ease-out, color 0s',
    margin: 0,
    padding: 0,
    pointerEvents: 'none',
  },
  labelFloating: {
    fontSize: 12,
    fontWeight: 400,
    bottom: '85%',
    opacity: 0.7,
  },
  unit: {
    fontSize: 16,
    fontWeight: 500,
    opacity: 0.5,
  },
  input: {
    border: 'none',
    outline: 'none',
    height: 20,
    fontSize: 16,
    fontWeight: 500,
    display: 'flex',
    flex: 1,
    margin: 0,
    padding: 0,
    background: 'none',
  },
  clearButton: {
    padding: 4,
    marginLeft: 16,
    transform: 'translateY(-4px)',
  },
  assistiveText: {
    padding: '5px 16px 0 16px',
    boxSizing: 'border-box',
    maxWidth: '100%',
    fontSize: 12,
  },
};
