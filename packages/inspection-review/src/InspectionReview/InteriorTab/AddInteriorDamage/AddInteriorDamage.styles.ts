import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    borderRadius: '20px 20px 20px 20px',
    top: '35px',
    width: '100%',
  },
  price: {
    border: 0,
    outlineWidth: 0,
    width: '100%',
    fontSize: '15px',
    letterSpacing: '0.5px',
    padding: '16px',
  },
  section: {
    padding: '16px',
  },
  inputSectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'row',
    border: 'solid rgba(1,1,1,0.4)',
    paddingRight: '10px',
    margin: '0px 19px 0px 19px',
  },
  footerContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '200px',
    padding: '10px 20px',
    border: 'solid rgba(1, 1, 1, .2)',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
    borderRadius: '9px',
  },
  currency: {
    alignSelf: 'center',
    paddingLeft: '20px',
    paddingRight: '5px',
  },
  cancel: {
    background: 'white',
  },
};
