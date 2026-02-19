import { Styles } from '@monkvision/types';

export const styles: Styles = {
  title: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '18px',
  },
  switchButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '16px',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  section: {
    padding: '16px',
  },

  damageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    paddingBottom: '10px',
  },
  damagesColumnContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: '5px',
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
    alignItems: 'center',
    border: 'solid rgba(1,1,1,0.4)',
    margin: '0px 19px 0px 19px',
  },
  inputSectionCurrencyLeft: {
    flexDirection: 'row-reverse',
  },
  input: {
    border: 0,
    outlineWidth: 0,
    width: '100%',
    fontSize: '15px',
    letterSpacing: '0.5px',
    padding: '16px',
  },

  currency: {
    display: 'flex',
    alignItems: 'center',
    height: '-webkit-fill-available',
    padding: '0px 10px',
    backgroundColor: 'white',
    color: 'black',
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
  cancel: {
    background: 'white',
  },
};
