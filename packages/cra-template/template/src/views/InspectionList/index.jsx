import Typography from '@mui/material/Typography';
import * as React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import PendingIcon from '@mui/icons-material/Pending';

export default function InspectionList({ inspections, ...props }) {
  return (
    <List sx={{ width: '100%' }} {...props}>
      {inspections.map(({ id }) => (
        <div key={`inspection-${id}`}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar><PendingIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={(
                <>
                  Inspection
                  <Chip sx={{ ml: 1, mb: 1 }} label={id.split('-')[0]} />
                </>
              )}
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline', mr: 1 }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    Pending...
                  </Typography>
                  Created monday february 7th at 2:00 PM
                </>
              )}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </div>
      ))}
    </List>
  );
}

InspectionList.propTypes = {
  inspections: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
};

InspectionList.defaultProps = {
  inspections: [],
};
