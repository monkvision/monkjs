import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, CssBaseline } from '@mui/material';

import sightsData from '@monkvision/sights/dist';
import SightCard from './SightCard';
import FiltersForm from './FiltersForm';
import styles from '../styles.module.css';

function Sights() {
  const context = useDocusaurusContext();
  const { siteConfig: { customFields = {}, tagline } = {} } = context;
  const [sights, setSights] = useState(Object.values(sightsData));
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  useEffect(() => {
    const filteredSights = Object.values(sightsData)
      .filter((sight) => (category === '' || category === sight.category))
      .filter((sight) => {
        const value = JSON.stringify(sight).toLocaleLowerCase();
        return typeof value === 'string' && value.includes(search.toLocaleLowerCase());
      });
    setSights(filteredSights);
  }, [search, category]);

  useEffect(() => {
    const categoryArr = sights.map((sight) => sight.category);
    const categories = categoryArr.filter((item, index) => categoryArr.indexOf(item) === index);
    setCategoryOptions(categories);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Layout title={tagline} description={customFields.description}>
        <Container
          className={styles.filtersBand}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            paddingBottom: 2,
          }}
          maxWidth={false}
          disableGutters
        >
          <FiltersForm
            categoryOptions={categoryOptions}
            onCategoryChange={setCategory}
            onSearchChange={setSearch}
          />
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingTop: '70px',
            paddingBottom: 2,
            backgroundColor: '#121212',
          }}
          maxWidth={false}
          disableGutters
        >
          <CssBaseline />
          {Object.values(sights)
            .filter((sight) => !!sight.overlay)
            .map((sight) => (
              <BrowserOnly key={sight.id}>
                {() => <SightCard {...sight} />}
              </BrowserOnly>
            ))}
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default Sights;
