import React from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { Loader } from '../../../components';

export default function InspectionList({ items, loadMore, hasNextPage }) {
  // eslint-disable-next-line react/prop-types,react/no-unstable-nested-components
  function Item({ index, style }) {
    const navigate = useNavigate();
    const navigateToDetails = () => {
      if (index < items.length) {
        navigate(`/inspections/${items[index].id}`);
      }
    };

    return (
      <div
        className="item"
        role="link"
        onClick={navigateToDetails}
        onKeyDown={navigateToDetails}
        tabIndex={index}
        style={{
          ...style,
          backgroundColor: index % 2 === 0 ? '#ffffff' : '#ebebeb',
          justifyContent: index === items.length ? 'center' : 'start',
        }}
      >
        {index === items.length ? <Loader width={50} height={50} /> : items[index].label}
      </div>
    );
  }

  const isItemLoaded = (itemsCount) => (index) => index + 1 < itemsCount;
  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <div style={{ flex: '1 1 auto' }}>
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded(itemCount)}
            itemCount={itemCount}
            loadMoreItems={loadMore}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                className="virtualized-list"
                height={height}
                itemCount={itemCount}
                itemSize={64}
                onItemsRendered={onItemsRendered}
                itemData={items}
                ref={ref}
                width={width}
              >
                {Item}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}

InspectionList.propTypes = {
  hasNextPage: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadMore: PropTypes.func.isRequired,
};
