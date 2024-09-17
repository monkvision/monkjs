import { Styles } from '@monkvision/types';

const SMALL_SCREEN__BREAKPOINT_PX = 650;
export const VEHICLE360_WIDTH_PX = 500;

export const styles: Styles = {
  container: {
    width: '100%',
    height: '100%',
  },
  title: {
    // position: 'absolute',
    // width: '100%',
    display: 'flex',
    padding: '16px',
    marginBottom: '20px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  vehicle360: {
    width: `${VEHICLE360_WIDTH_PX}px`,
    position: 'absolute',
    paddingLeft: '35px',
    paddingRight: '35px',
    // top: '50px'
  },
  vehicle360SmallScreen: {
    __media: { maxWidth: SMALL_SCREEN__BREAKPOINT_PX },
  },
  gallery: {
    width: `calc(100% - ${VEHICLE360_WIDTH_PX}px)`,
    position: 'absolute',
    height: '100%',
    overflow: 'auto',
    right: 0,
    // paddingTop: '75px',
    paddingRight: '20px',
  },
  header: {
    // position: 'absolute',
    width: '100%',
    display: 'flex',
    // padding: '16px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    alignItems: 'center',
  },
};
