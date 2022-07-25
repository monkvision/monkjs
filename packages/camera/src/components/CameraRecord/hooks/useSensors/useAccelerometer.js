import { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function useAccelerometer() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  const handleSubscribe = () => setSubscription(Accelerometer.addListener(
    (accelerometerData) => setData(accelerometerData),
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
