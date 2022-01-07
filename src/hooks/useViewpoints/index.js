import { useState } from 'react';
import Metadata from './metadata';

export const useViewpoints = () => {
  const [metadata, setMetadata] = useState(new Metadata());
  return { metadata, setMetadata };
};

export default useViewpoints;
