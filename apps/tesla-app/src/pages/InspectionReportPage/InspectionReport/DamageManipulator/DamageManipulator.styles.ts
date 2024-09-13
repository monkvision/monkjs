import { Styles } from '@monkvision/types';
import { VEHICLE360_WIDTH_PX } from '../InspectionReport.styles';

export const styles: Styles = {
  container: {
    alignSelf: 'end',
    position: 'fixed',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    // border: 'solid rgba(255,255,255,0.4)',
    borderRadius: '20px 20px 20px 20px',
    top: '35px',
    // transform: 'translate(0, -50%)',
    // width: '375px',
    width: `calc(${VEHICLE360_WIDTH_PX - 35}px)`,
  },
  containerPortrait: {
    __media: { portrait: true },
    // width: '100%',
  },
  content: {
    // width: '375px',
    // width: `${VEHICLE360_WIDTH_PX}px`,
    width: '100%',
  },
  price: {
    color: 'white',
    border: 0,
    outlineWidth: 0,
    width: '40px',
    fontSize: '15px',
    letterSpacing: '0.5px',
  },
  title: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '18px',
  },
  section: {
    padding: '16px',
  },
};
