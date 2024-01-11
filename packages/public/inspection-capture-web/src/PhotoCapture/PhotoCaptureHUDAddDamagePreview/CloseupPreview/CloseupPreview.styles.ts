import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    top: '0',
    right: '0',
    left: '0',
    bottom: '0',
  },
  top: {
    position: 'absolute',
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '10px',
    zIndex: '9',
    top: '0',
    right: '0',
    left: '0',
  },
  frameContainer: {
    position: 'absolute',
    width: '100%',
  },
  frame: {
    position: 'absolute',
    top: '25%',
    left: '32%',
    width: '36%',
    height: '50%',
    border: '2px solid #FFC000',
    borderRadius: '10px',
    boxShadow: '0px 0px 0px 100pc rgba(0, 0, 0, 0.5)',
  },
  label: {
    position: 'absolute',
    top: '0',
    color: 'white',
    margin: '20px',
    padding: '10px 24px',
  },
  labelPortrait: {
    __media: { portrait: true },
    top: '10%',
  },
  infoCloseup: {
    position: 'absolute',
    bottom: '0',
    color: 'white',
    margin: '20px',
    padding: '10px 24px',
    textAlign: 'center',
  },
};
