import { Styles } from '@monkvision/types';

export const SMALL_WIDTH_BREAKPOINT = 700;

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 10,
    gap: '15px',
    flexDirection: 'row',
  },
  containerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    justifyContent: 'center',
    flexDirection: 'column',
  },
  elementsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentContainer: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    flexDirection: 'column',
    paddingBottom: '20px',
  },
  contentContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    width: '80%',
  },
  textcontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    flexDirection: 'column',
  },
  title: {
    fontSize: '22px',
  },
  description: {
    fontSize: '14px',
    textAlign: 'center',
    paddingBottom: '10px',
  },
  buttonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    gap: '3px',
  },
};
