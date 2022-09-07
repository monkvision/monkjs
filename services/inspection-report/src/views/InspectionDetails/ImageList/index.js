import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';

import InfoIcon from '@mui/icons-material/Info';
import TireIcon from '@mui/icons-material/BlurCircular';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import IconButton from '@mui/material/IconButton';
import MUIImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

// import { DamageHighlight } from '@monkvision/visualization';

import { Menu } from 'components';

export default function ImageList({ itemData }) {
  const navigate = useNavigate();
  const { id: inspectionId } = useParams();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [imageId, setImageId] = React.useState(null);

  const handleClick = (event, id) => { setAnchorEl(event.currentTarget); setImageId(id); };
  const handleClose = () => setAnchorEl(null);

  // the selected wheel analysis if present
  const selectedWheelAnalysis = useMemo(
    () => itemData.images?.find((item) => item.id === imageId)?.wheelAnalysis,
    [itemData, imageId],
  );

  const options = useMemo(() => [
    { label: 'Wheel analysis', icon: <TireIcon />, disabled: !selectedWheelAnalysis, onClick: () => navigate(`/wheelAnalysis/${inspectionId}/${selectedWheelAnalysis?.id}`) },
    { label: 'Damage detection', icon: <CarCrashIcon />, disabled: true, onClick: () => {} },
  ], [navigate, inspectionId, selectedWheelAnalysis]);

  return (
    <>
      <Menu
        options={options}
        MenuListProps={{ 'aria-labelledby': 'info-button' }}
        anchorEl={anchorEl}
        onClose={handleClose}
        open={!!anchorEl}
      />
      <MUIImageList>
        {itemData.images.map((item, i) => (item ? (
          // eslint-disable-next-line react/no-array-index-key
          <ImageListItem key={`${item.path}-${i}`}>
            {/* <DamageHighlight
                damages={itemData.damages}
                damageStyle={(damage) => (damage.damageType === 'dent' ?
                { stroke: 'red', strokeDasharray: '5, 5' } : {})}
                image={item}
                onPressDamage={(damage) => { console.log(damage); }}
              /> */}
            <ImageListItemBar
              title={item?.additionalData?.label?.en}
              actionIcon={(
                <IconButton
                  onClick={(e) => handleClick(e, item.id)}
                  id="info-button"
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
    </>
  );
}

ImageList.propTypes = {
  itemData: PropTypes.shape({
    damages: PropTypes.arrayOf(PropTypes.shape({
      createdBy: PropTypes.string,
      damageType: PropTypes.string,
      deletedAt: PropTypes.string,
      id: PropTypes.string,
      inspectionId: PropTypes.string,
    })),
    images: PropTypes.arrayOf(PropTypes.shape({
      additionalData: PropTypes.shape({
        label: PropTypes.objectOf(PropTypes.string).isRequired,
      }),
      id: PropTypes.string.isRequired,
      imageHeight: PropTypes.number.isRequired,
      imageWidth: PropTypes.number.isRequired,
      path: PropTypes.string.isRequired,
      views: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        imageRegion: PropTypes.shape({
          specification: PropTypes.shape({
            boundingBox: PropTypes.shape({
              height: PropTypes.number,
              width: PropTypes.number,
              xmin: PropTypes.number,
              ymin: PropTypes.number,
            }).isRequired,
            polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))),
          }),
        }),
      })),
    })),
  }),
};

ImageList.defaultProps = {
  itemData: {},
};
