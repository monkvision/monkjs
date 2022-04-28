import { makeStyles } from '@mui/styles';
import React, { useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../../components';

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    height: '100%',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#dddddd !important',
    },
  },
}));

function ListItem({ item, tabIndex, isLoader, isEvenItem, style }) {
  const navigate = useNavigate();
  const styles = useStyles();
  const navigateToDetails = () => {
    if (!isLoader) {
      navigate(`/inspections/${item.id}`);
    }
  };

  return (
    <div
      className={styles.item}
      role="link"
      onClick={navigateToDetails}
      onKeyDown={navigateToDetails}
      tabIndex={tabIndex}
      style={{
        ...style,
        backgroundColor: isEvenItem ? '#ffffff' : '#ebebeb',
        justifyContent: isLoader ? 'center' : 'start',
      }}
    >
      {isLoader ? <Loader width={50} height={50} /> : item.label}
    </div>
  );
}

ListItem.propTypes = {
  isEvenItem: PropTypes.bool.isRequired,
  isLoader: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
};

export default function InspectionList({ items, loadMore, hasNextPage }) {
  const Item = useCallback(({ index, style }) => {
    const item = items[index];
    const isLoader = index === items.length;
    const isEvenItem = index % 2 === 0;

    return (
      <ListItem
        item={item}
        tabIndex={index}
        isLoader={isLoader}
        isEvenItem={isEvenItem}
        style={style}
      />
    );
  }, [items]);

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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  loadMore: PropTypes.func.isRequired,
};
