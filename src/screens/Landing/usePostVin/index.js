import { useEffect } from 'react';

export default function usePostVin({ params }) {
  useEffect(() => {
    if (params?.vin) {
      // post vin
      console.log('uploading vin:', params.vin);
    }
  }, [params]);
}
