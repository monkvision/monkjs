import React, { useCallback, useEffect, useState } from 'react';
import propTypes from 'prop-types';

import { FormControl, InputLabel, OutlinedInput, MenuItem, Select } from '@mui/material';
import noop from '@docusaurus/core/lib/client/exports/Noop';

export default function FiltersForm({ categoryOptions, onCategoryChange, onSearchChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const handleCategory = useCallback((event) => {
    setCategory(event.target.value);
    onCategoryChange(event.target.value);
  }, [category]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, [search]);

  useEffect(() => {
    const timerId = setTimeout(() => onSearchChange(search), 500);
    return () => clearTimeout(timerId);
  }, [search]);

  return (
    <>
      <FormControl sx={{ minWidth: 120 }} size="small">
        <InputLabel>Category</InputLabel>
        <Select
          label="Category"
          autoWidth={false}
          value={category}
          onChange={handleCategory}
          sx={{ textTransform: 'capitalize' }}
        >
          <MenuItem value="">None</MenuItem>
          {categoryOptions.map((option) => (
            <MenuItem
              key={option}
              value={option}
              sx={{ textTransform: 'capitalize' }}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ marginLeft: 1, minWidth: 120 }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-search" size="small">Search</InputLabel>
        <OutlinedInput
          id="outlined-adornment-search"
          type="text"
          label="Search"
          defaultValue={search}
          value={search}
          size="small"
          onChange={handleSearch}
        />
      </FormControl>
    </>
  );
}

FiltersForm.propTypes = {
  categoryOptions: propTypes.arrayOf(propTypes.string),
  onCategoryChange: propTypes.func,
  onSearchChange: propTypes.func,
};

FiltersForm.defaultProps = {
  categoryOptions: [],
  onCategoryChange: noop,
  onSearchChange: noop,
};
