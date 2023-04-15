import React from 'react';
import EnhancedSearch from 'enhancedocs-search';

import 'enhancedocs-search/dist/style.css';

const SearchBarWrapper = (props) => {
  return (
    <EnhancedSearch
      config={{
        enhancedSearch: {
          projectId: '<replace_with_project_id>',
          accessToken: '<replace_with_access_token>'
        }
      }}
      theme={{
        primaryColor: '#3578e5'
      }}
      {...props}
    />
  );
};

export default SearchBarWrapper;
