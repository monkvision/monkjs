import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import MUIImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import PropTypes from 'prop-types';
import * as React from 'react';

export default function ImageList({ itemData }) {
  return (
    <MUIImageList>
      {itemData.map((item) => (item ? (
        <ImageListItem key={item.path}>
          <img
            src={item.path}
            alt={item?.additionalData?.label}
            loading="lazy"
          />
          <ImageListItemBar
            title={item?.additionalData?.label}
            actionIcon={(
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item?.additionalData?.label}`}
              >
                <InfoIcon />
              </IconButton>
            )}
          />
        </ImageListItem>
      ) : null))}
    </MUIImageList>
  );
}

ImageList.propTypes = {
  itemData: PropTypes.arrayOf(PropTypes.shape({
    additionalData: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
    path: PropTypes.string.isRequired,
  })),
};

ImageList.defaultProps = {
  itemData: [],
};
