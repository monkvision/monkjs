import React, { useCallback, useEffect, useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import sightsData from '@monkvision/sights/dist';
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

console.log(sightsData);

// eslint-disable-next-line react/prop-types
function SightCard({
  id,
  label,
  category,
  vehicleType,
  overlay,
}) {
  const base64 = btoa(unescape(encodeURIComponent(overlay)));

  return (
    <Card sx={{
      width: '100%',
      maxWidth: '320px',
      margin: '8px',
    }}
    >
      <CardMedia
        component="img"
        alt={label}
        height="240"
        image={`data:image/svg+xml;base64,${base64}`}
      />
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line react/prop-types */}
          {label.charAt(0)
            .toUpperCase() + label.slice(1)}
          <Chip label={id} />
        </Typography>
      </CardContent>
      <Box
        component="pre"
        sx={{
          backgroundColor: 'black',
          borderRadius: 0,
        }}
      >
        {JSON.stringify({
          id,
          label,
          category,
          vehicleType,
        }, null, 2)}
      </Box>
    </Card>
  );
}

function Sights() {
  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState([]);
  const [vehicleType, setVehicleType] = useState(null);
  const [category, setCategory] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sightResult, setSightResult] = useState(Object.values(sightsData));
  const context = useDocusaurusContext();

  const {
    siteConfig: {
      customFields = {},
      tagline,
    } = {},
  } = context;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const handleChange = (event, setter) => {
    if (event?.target?.value) {
      setter(event.target.value);
    }
  };

  const handleAddWord = (event) => {
    if (event && event.keyCode === 32) {
      event.preventDefault();
      const keyword = event.target.value.substring(0, event.target.value.length - 1);
      setSearchKeyword((prevState) => [...prevState, keyword]);
      setSearchInput('');
    }

    return event?.keyCode !== 32;
  };

  const handleDelete = useCallback((indice) => {
    if (searchKeyword) {
      setSearchKeyword((prevState) => prevState.filter((_, i) => i !== indice));
    }
  }, [searchKeyword]);

  const getSuggestion = useMemo(() => {
    const labels = Object.values(sightsData)
      .flatMap((sight) => sight.label.split(' '))
      .filter((label, index, self) => (
        self.indexOf(label) === index && !searchKeyword.includes(label)
      ));

    return labels.concat(Object.keys(sightsData));
  }, [searchKeyword]);

  const getFilterList = (key) => Object.values(sightsData)
    .map((sight) => sight[key])
    .filter((item, index, self) => self.indexOf(item) === index);

  useEffect(() => {
    setSightResult(() => {
      const categoryFilter = Object.values(sightsData)
        .filter((sight) => (category && category !== 'all') && sight.category === category);

      const typeFilter = Object.values(sightsData)
        .filter((sight) => (vehicleType && category !== 'all') && sight.vehicleType === vehicleType);

      const searchFilter = Object.values(sightsData)
        .filter((sight) => (searchKeyword.length > 0) && (searchKeyword.includes(sight.id)
          || sight.label
            .split(' ')
            .map((label) => searchKeyword.includes(label))
            .reduce((prev, curr) => curr || prev, false)));

      const newResult = categoryFilter
        .concat(typeFilter, searchFilter)
        .filter((item, index, self) => self.indexOf(item) === index);

      return ((newResult.length <= 0) ? Object.values(sightsData) : newResult)
        .sort((a, b) => {
          if (a[sortBy].toLocaleLowerCase() < b[sortBy].toLocaleLowerCase()) {
            return -1;
          }
          if (a[sortBy].toLocaleLowerCase() > b[sortBy].toLocaleLowerCase()) {
            return 1;
          }
          return 0;
        });
    });
  }, [category, vehicleType, searchKeyword, sortBy]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Layout title={tagline} description={customFields.description}>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="center"
          style={{ margin: '15px 0' }}
        >
          <Autocomplete
            style={{
              width: 'calc(97% - 450px)',
              minWidth: 150,
            }}
            inputValue={searchInput}
            onInputChange={(e) => handleChange(e, setSearchInput)}
            onChange={(event, newKeyword) => {
              setSearchKeyword((prevState) => [...prevState, newKeyword]);
            }}
            options={getSuggestion}
            renderInput={(params) => (
              <TextField
                {...params}
                onKeyUp={handleAddWord}
                label="Search"
              />
            )}
          />
          <FormControl style={{ width: 150 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Category"
              value={category}
              onChange={(e) => handleChange(e, setCategory)}
            >
              <MenuItem value="all">all</MenuItem>
              {getFilterList('category')
                .map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl style={{ width: 150 }}>
            <InputLabel id="demo-simple-select-label">Vehicle type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Vehicle type"
              value={vehicleType}
              onChange={(e) => handleChange(e, setVehicleType)}
            >
              <MenuItem value="all">all</MenuItem>
              {getFilterList('vehicleType')
                .map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl style={{ width: 150 }}>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Sort by"
              value={sortBy}
              onChange={(e) => handleChange(e, setSortBy)}
            >
              {Object.keys(Object.values(sightsData)[0])
                .filter((sort) => sort !== 'overlay')
                .map((sort) => <MenuItem key={sort} value={sort}>{sort}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={1} style={{ margin: '0 10px' }}>
          {searchKeyword.map((keyword, i) => (
            <Chip
              key={keyword}
              label={keyword}
              onDelete={() => {
                handleDelete(i);
              }}
            />
          ))}
        </Stack>

        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
          disableGutters
        >
          <CssBaseline />
          {sightResult
            .map((sight) => (
              <BrowserOnly>
                {() => <SightCard key={sight.id} {...sight} />}
              </BrowserOnly>
            ))}
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default Sights;
