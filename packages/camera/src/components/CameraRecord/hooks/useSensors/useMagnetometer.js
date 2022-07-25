import { useEffect, useState } from 'react';
import { Magnetometer } from 'expo-sensors';

export default function useMagnetometer() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);

  const handleSubscribe = () => setSubscription(Magnetometer.addListener(
    (magnetometerData) => setData(magnetometerData),
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
