import { Styles } from '@monkvision/types';
import { SMALL_WIDTH_BREAKPOINT } from '../ImageDetailedView.styles';

export const styles: Styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px 140px',
    boxSizing: 'border-box',
  },
  mainContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    padding: '20px 40px 80px 40px',
  },
  overlayDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  complianceContainer: {
    alignSelf: 'stretch',
    display: 'flex',
  },
  complianceContainerSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    flexDirection: 'column',
  },
  complianceMessageContainer: {
    display: 'flex',
  },
  complianceMessage: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    padding: '0 20px 0 10px',
  },
  complianceRetakeButton: {
    alignSelf: 'center',
  },
  complianceRetakeButtonSmall: {
    __media: { maxWidth: SMALL_WIDTH_BREAKPOINT },
    alignSelf: 'start',
    margin: '8px 0 0 30px',
  },
  complianceTitle: {
    fontSize: 14,
    opacity: 0.7,
    paddingBottom: 5,
  },
  complianceDescription: {
    fontSize: 14,
  },
  imageLabel: {
    padding: '8px 12px',
    fontSize: 16,
    borderRadius: 9999,
    display: 'flex',
    alignItems: 'center',
  },
  imageLabelIcon: {
    marginRight: 8,
  },
};
