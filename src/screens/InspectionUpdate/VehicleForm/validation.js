import * as Yup from 'yup';

const vehicleValidationSchema = Yup.object({
//   brand: Yup.string(),
//   model: Yup.string(),
//   plate: Yup.string(),
//   vehicle_type: Yup.string(),
  market_value: Yup.object().shape({
    unit: Yup.string().required('Please choose the Market Value unit'),
    value: Yup.number().typeError('Invalid value').required('Please add the Market Value value'),
  }),
  mileage: Yup.object().shape({
    unit: Yup.string().required('Please choose the Mileage unit'),
    value: Yup.number().typeError('Invalid value')
      .required('Please add the Mileage value'),
  }),
//   vin: Yup.string(),
//   color: Yup.string(),
//   exterior_cleanliness: Yup.string(),
//   interior_cleanliness: Yup.string(),
//   date_of_circulation: Yup.string(),
});

export default vehicleValidationSchema;
