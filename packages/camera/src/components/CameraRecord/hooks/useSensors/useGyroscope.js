import { useEffect, useState } from 'react';
import { Gyroscope } from 'expo-sensors';

export default function useGyroscpe() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  const handleSubscribe = () => setSubscription(Gyroscope.addListener(
    (gyroscopeData) => setData(gyroscopeData),
  ));

  const handleUnsubscribe = () => {
    if (subscription) { subscription.remove(); }
    setSubscription(null);
  };

  useEffect(() => {
    handleSubscribe();
    return () => handleUnsubscribe();
  }, []);

  return data;
}
