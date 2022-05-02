import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import MUIImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { DamageHighlight } from '@monkvision/visualization';
import PropTypes from 'prop-types';
import * as React from 'react';

export default function ImageList({ itemData }) {
  return (
    <MUIImageList>
      {itemData.map((item) => {
        const polygonsProps = item?.damages?.length > 0 ? { damages:
            item.damages.map(({ imageRegion, damageType }) => (
              { damageType, polygons: imageRegion.specification.polygons }
            )) } : {};

        return (item ? (
          <ImageListItem key={item.path}>
            <DamageHighlight
              image={{
                height: item.imageHeight,
                width: item.imageWidth,
                source: { uri: item.path },
                id: item.id,
              }}
              options={{
                background: {
                  opacity: 1,
                },
                polygons: {
                  stroke: {
                    color: 'yellow',
                    strokeWidth: 5,
                  },
                },
                label: {
                  fontSize: 5,
                },
              }}
              {...polygonsProps}
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
        ) : null);
      })}
    </MUIImageList>
  );
}

ImageList.propTypes = {
  itemData: PropTypes.arrayOf(PropTypes.shape({
    additionalData: PropTypes.shape({
      label: PropTypes.string.isRequired,
    }),
    damages: PropTypes.arrayOf(PropTypes.shape({
      damageType: PropTypes.string,
      id: PropTypes.string.isRequired,
      imageRegion: PropTypes.shape({
        specification: PropTypes.shape({
          polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
        }),
      }),
    })),
    path: PropTypes.string.isRequired,
  })),
};

ImageList.defaultProps = {
  itemData: [],
};
