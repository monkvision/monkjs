import { useEffect, useState } from 'react';
import kebabCase from 'lodash.kebabcase';

export default function useMasks(sights) {
  const [masks, setMasks] = useState({});

  useEffect(() => {
    const entries = sights
      // eslint-disable-next-line global-require,import/no-dynamic-require
      .map(([id]) => [id, require(`../../assets/sightMasks/${kebabCase(id)}.svg`)]);

    setMasks(Object.fromEntries(entries));
  }, [sights]);

  return masks;
}
