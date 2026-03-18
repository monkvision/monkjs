import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../../src/hooks', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

jest.mock(
  '../../../src/components/ReviewGallery/SpotlightImage/Shortcuts/hooks/useShortcuts',
  () => ({
    useShortcuts: jest.fn(),
  }),
);

const mockSpotlightImage = jest.fn(({ selectedItem, showDamage }: any) => (
  <div data-testid='spotlight' data-image={selectedItem.image.id}>
    spotlight {String(showDamage)}
  </div>
));

jest.mock('../../../src/components/ReviewGallery/SpotlightImage', () => ({
  SpotlightImage: (props: any) => mockSpotlightImage(props),
}));

jest.mock('../../../src/components/ReviewGallery/GalleryItem/GalleryItemCard', () => ({
  GalleryItemCard: ({ item, onSelectItemById }: any) => (
    <div data-testid='gallery-card' onClick={() => onSelectItemById(item.image.id)}>
      card {item.image.id}
    </div>
  ),
}));

const { useInspectionReviewProvider } = jest.requireMock('../../../src/hooks') as {
  useInspectionReviewProvider: jest.Mock;
};

const { useShortcuts } = jest.requireMock(
  '../../../src/components/ReviewGallery/SpotlightImage/Shortcuts/hooks/useShortcuts',
) as { useShortcuts: jest.Mock };

const { ReviewGallery } = require('../../../src/components/ReviewGallery/ReviewGallery');

const createGalleryItem = (id: string) => ({
  image: { id },
});

const baseShortcuts = {
  showDamage: false,
  toggleShowDamage: jest.fn(),
  goToNextImage: jest.fn(),
  goToPreviousImage: jest.fn(),
};

describe('ReviewGallery', () => {
  const onSelectItemById = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useShortcuts.mockReturnValue(baseShortcuts);
  });

  it('renders gallery items when nothing is selected', () => {
    const items = [createGalleryItem('img-1'), createGalleryItem('img-2')];
    useInspectionReviewProvider.mockReturnValue({
      currentGalleryItems: items,
      selectedItem: null,
      onSelectItemById,
    });

    render(<ReviewGallery />);

    const cards = screen.getAllByTestId('gallery-card');
    expect(cards).toHaveLength(2);

    fireEvent.click(cards[0]);
    expect(onSelectItemById).toHaveBeenCalledWith('img-1');
    expect(screen.queryByTestId('spotlight')).not.toBeInTheDocument();
  });

  it('renders spotlight when an item is selected', () => {
    const selectedItem = createGalleryItem('img-3');
    useInspectionReviewProvider.mockReturnValue({
      currentGalleryItems: [selectedItem],
      selectedItem,
      onSelectItemById,
    });
    useShortcuts.mockReturnValue({ ...baseShortcuts, showDamage: true });

    render(<ReviewGallery />);

    expect(screen.getByTestId('spotlight')).toHaveTextContent('spotlight true');
    expect(mockSpotlightImage).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedItem,
        showDamage: true,
        onSelectItemById,
        toggleShowDamage: baseShortcuts.toggleShowDamage,
        goToNextImage: baseShortcuts.goToNextImage,
        goToPreviousImage: baseShortcuts.goToPreviousImage,
      }),
    );
    expect(screen.queryByTestId('gallery-card')).not.toBeInTheDocument();
  });
});
