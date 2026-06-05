import { Styles } from '@monkvision/types';

export const styles: Styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pricingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingRight: 40,
  },

  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  icon: {
    width: 23,
    height: 23,
    padding: 3,
    borderRadius: 4,
    backgroundColor: '#7496b4',
    textAlign: 'center',
  },
  iconText: {
    fontSize: 20,
    margin: 0,
    color: 'white',
  },

  vin: {
    backgroundColor: 'lightgray',
    padding: '4px 6px 4px 6px',
    borderRadius: 4,
  },
};
