import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplate: `'title button' auto
                    'slider slider' 1fr / 1fr auto`,
    justifyItems: 'start',
  },
  containerSmall: {
    __media: { maxWidth: 500 },
    gridTemplate: `'title' 0
                  'slider' 1fr
                  'button' 1fr/ auto`,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 50px',
  },
  title: {
    gridArea: 'title',
    fontSize: 22,
    padding: '50px',
  },
  button: {
    gridArea: 'button',
    margin: '10px',
    placeSelf: 'center',
  },
  sliderContainer: {
    gridArea: 'slider',
    width: '100%',
    maxWidth: '100vw',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  sliderContainerSmall: {
    __media: { maxWidth: 500 },
    marginBottom: '0',
    translate: '0 50%',
  },
  slider: {
    alignSelf: 'stretch',
    maxWidth: '100%',
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '45%',
    paddingRight: '45%',
  },
};
