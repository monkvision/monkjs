import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { Avatar, List } from 'react-native-paper';

export default function ListItem({ createdAt, id, images, index, style, ...rest }) {
  const left = useCallback(
    () => {
      const icon = () => (
        <Avatar.Image
          size={44}
          source={images[0].path}
        />
      );
      return <List.Icon icon={icon} />;
    },
    [images],
  );

  const title = useMemo(() => moment(createdAt).format('LLL'), [createdAt]);
  const backgroundColor = useMemo(
    () => (index % 2 === 0 ? undefined : `rgba(0, 0, 0, 0.2)`),
    [index],
  );

  return (
    <List.Item
      style={[{ backgroundColor }, style]}
      title={title}
      left={left}
      {...rest}
    />
  );
}

ListItem.propTypes = {
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string.isRequired,
  })),
  index: PropTypes.number.isRequired,
};

ListItem.defaultProps = {
  images: [],
};
