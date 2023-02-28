import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AddDamageButton from '../AddDamageButton';

describe('Add Damage Button component', () => {
  it('renders the correct message', () => {
    render(<AddDamageButton label="add damage button" customStyle={{}} />);
    expect(screen.getByTestId('addDamageButton')).toBeOnTheScreen();
  });
});
