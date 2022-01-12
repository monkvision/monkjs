import * as React from 'react';
import { useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import ReactJson from 'react-json-view'

export default function SightCard(props) {
  const { id, label, image } = props;
  const theme = useTheme()

  return (
    <Card sx={{
      width: 500,
      margin: 'auto',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }}>
      <CardMedia
        component="img"
        alt={label}
        height="375"
        image={image}
      />
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
          <Chip label={id} />
        </Typography>
        <ReactJson
          style={{
            margin: 0,
            marginTop: theme.spacing(2),
          }}
          src={props}
          theme="harmonic"
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
          collapseStringsAfterLength={20}
        />
      </CardContent>
    </Card>
  );
}
