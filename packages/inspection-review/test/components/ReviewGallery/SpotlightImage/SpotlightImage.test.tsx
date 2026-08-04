import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GalleryItem } from '../../../../src';
import { Image } from '@monkvision/types';

jest.mock('@monkvision/common', () => ({
  useObjectTranslation: jest.fn(() => ({ tObj: (value: any) => value })),
}));

jest.mock('@monkvision/common-ui-web', () => ({
  Button: jest.fn(({ children, icon, primaryColor, secondaryColor, ...props }) => (
    <button {...props}>{children || icon}</button>
  )),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

jest.mock('../../../../src/components/ReviewGallery/SpotlightImage/hooks/useZoomPan', () => ({
  useZoomPan: jest.fn(),
}));

jest.mock(
  '../../../../src/components/ReviewGallery/SpotlightImage/hooks/useSpotlightImage',
  () => ({
    useSpotlightImage: jest.fn(),
  }),
);

jest.mock('../../../../src/components/ReviewGallery/SpotlightImage/SpotlightImage.styles', () => ({
  styles: {},
  useSpotlightImageStyles: jest.fn(),
}));

jest.mock('../../../../src/components/ReviewGallery/SpotlightImage/Shortcuts', () => ({
  Shortcuts: ({ showDamage }: any) => (
    <div data-testid='shortcuts'>shortcuts {String(showDamage)}</div>
  ),
}));

const { useSpotlightImage } = jest.requireMock(
  '../../../../src/components/ReviewGallery/SpotlightImage/hooks/useSpotlightImage',
) as { useSpotlightImage: jest.Mock };

const { useZoomPan } = jest.requireMock(
  '../../../../src/components/ReviewGallery/SpotlightImage/hooks/useZoomPan',
) as { useZoomPan: jest.Mock };

const { useSpotlightImageStyles } = jest.requireMock(
  '../../../../src/components/ReviewGallery/SpotlightImage/SpotlightImage.styles',
) as { useSpotlightImageStyles: jest.Mock };

const {
  SpotlightImage,
} = require('../../../../src/components/ReviewGallery/SpotlightImage/SpotlightImage');

const createSelectedItem = (overrides: Partial<GalleryItem> = {}): GalleryItem =>
  ({
    image: { id: 'img-1', path: 'original.jpg', label: 'Front' } as unknown as Image,
    hasDamage: true,
    ...overrides,
  } as GalleryItem);

const baseHookState: ReturnType<typeof useSpotlightImage> = {
  backgroundImage: 'bg.jpg',
  isMouseOver: true,
  cursorStyle: 'grab',
  handleMouseDown: jest.fn(),
  handleMouseUp: jest.fn(),
  activationKeys: ['Meta'],
};

const baseZoomPanState: ReturnType<typeof useZoomPan> = {
  wrapperRef: { current: null },
  contentRef: { current: null },
  contentStyle: {},
  isPanning: false,
  onPointerDown: jest.fn(),
  onPointerMove: jest.fn(),
  onPointerUp: jest.fn(),
  reset: jest.fn(),
};

const baseStyles = {
  iconButtonStyle: {},
  showDamageButtonStyle: {},
  imageLabelStyle: {},
  containerStyle: {},
};

describe('SpotlightImage', () => {
  const onSelectItemById = jest.fn();
  const goToPreviousImage = jest.fn();
  const goToNextImage = jest.fn();
  const toggleShowDamage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSpotlightImage.mockReturnValue(baseHookState);
    useZoomPan.mockReturnValue(baseZoomPanState);
    useSpotlightImageStyles.mockReturnValue(baseStyles);
  });

  it('renders the spotlight image with label and shortcuts', () => {
    render(
      <SpotlightImage
        selectedItem={createSelectedItem()}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'bg.jpg');
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByTestId('shortcuts')).toHaveTextContent('shortcuts false');
  });

  it('hides overlay actions when mouse is not over', () => {
    useSpotlightImage.mockReturnValue({ ...baseHookState, isMouseOver: false });

    render(
      <SpotlightImage
        selectedItem={createSelectedItem()}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    expect(screen.queryByText('close')).not.toBeInTheDocument();
    expect(screen.queryByText('gallery.spotlight.showDamages')).not.toBeInTheDocument();
  });

  it('calls navigation and close handlers from buttons', () => {
    render(
      <SpotlightImage
        selectedItem={createSelectedItem()}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    fireEvent.click(screen.getByText('chevron-left'));
    fireEvent.click(screen.getByText('chevron-right'));
    fireEvent.click(screen.getByText('close'));

    expect(goToPreviousImage).toHaveBeenCalled();
    expect(goToNextImage).toHaveBeenCalled();
    expect(onSelectItemById).toHaveBeenCalledWith(null);
  });

  it('toggles damages visibility when button clicked', () => {
    render(
      <SpotlightImage
        selectedItem={createSelectedItem({ hasDamage: true })}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    fireEvent.click(screen.getByText('gallery.spotlight.showDamages'));

    expect(toggleShowDamage).toHaveBeenCalled();
  });

  it('resets zoom and pan when the displayed image changes', () => {
    const { rerender } = render(
      <SpotlightImage
        selectedItem={createSelectedItem()}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    expect(baseZoomPanState.reset).toHaveBeenCalledTimes(1);

    rerender(
      <SpotlightImage
        selectedItem={createSelectedItem({
          image: { id: 'img-2', path: 'other.jpg', label: 'Rear' } as unknown as Image,
        })}
        onSelectItemById={onSelectItemById}
        goToNextImage={goToNextImage}
        goToPreviousImage={goToPreviousImage}
        showDamage={false}
        toggleShowDamage={toggleShowDamage}
      />,
    );

    expect(baseZoomPanState.reset).toHaveBeenCalledTimes(2);
  });
});
