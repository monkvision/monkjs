import { useFormik } from 'formik';

export default function useForm() {
  return useFormik({
    initialValues: { vin: '', captureMod: 'car360', saveInDevice: false },
    enableReinitialize: true,
  });
}
