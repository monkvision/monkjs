import React, { useCallback, useState } from 'react';
import { Feedback } from '@monkvision/feedback';
import { View } from 'react-native';

export default function InspectionFeedback() {
  const [interior, setInterior] = useState('');
  const [windShieldCondition, setWindShieldCondition] = useState('');
  const [tireCondition, setTireCondition] = useState('');
  const [tireConditionSingleSelect, setTireConditionSingleSelect] = useState('');
  const [tireConditionMultiSelect, setTireConditionMultiSelect] = useState([]);
  const [vehicleInterior, setVehicleInterior] = useState('');

  const handleSubmit = useCallback(() => {
    console.log('🚀 interior : ', interior);
    console.log('🚀 windShieldCondition : ', windShieldCondition);
    console.log('🚀 tireCondition : ', tireCondition);
    console.log('🚀 tireConditionSingleSelect : ', tireConditionSingleSelect);
    console.log('🚀 tireConditionMultiSelect : ', tireConditionMultiSelect);
    console.log('🚀 vehicleInterior : ', vehicleInterior);
  }, [
    interior,
    windShieldCondition,
    tireCondition,
    tireConditionSingleSelect,
    tireConditionMultiSelect,
    vehicleInterior
  ]);

  return (
    <View style={{ backgroundColor: '#121212', flex: 1, padding: 15 }}>
      <Feedback
        questions={[{
          type: 'text',
          question: 'How is the interior of the vehicle?',
          answer: interior,
          onChange: (value) => setInterior(value)
        }, {
          type: 'radio',
          question: 'Is the windshield in good condition?',
          answer: windShieldCondition,
          onChange: (data) => setWindShieldCondition(data.value),
          options: [
            { label: 'Y', value: true },
            { label: 'N', value: false },
          ],
        }, {
          type: 'select',
          question: 'Is the tire condition normal (Single Select)?',
          answer: tireConditionSingleSelect,
          onChange: (data) => setTireConditionSingleSelect(data),
          options: [
            { label: 'Poor', value: 'Poor' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Good', value: 'Good' },
            { label: 'Great', value: 'Great' },
          ],
        }, {
          type: 'select',
          question: 'Is the tire condition normal (Multi Select)?',
          answer: tireConditionMultiSelect,
          config: {
            isMulti: true,
          },
          onChange: (data) => setTireConditionMultiSelect(data),
          options: [
            { label: 'Poor', value: 'Poor' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Good', value: 'Good' },
            { label: 'Great', value: 'Great' },
          ],
        }, {
          type: 'radio',
          question: 'Is the tire condition normal?',
          answer: tireCondition,
          onChange: (data) => setTireCondition(data.value),
          options: [
            { label: 'Poor', value: 'Poor' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Good', value: 'Good' },
            { label: 'Great', value: 'Great' },
          ],
        }, {
          type: 'radio',
          question: 'How is the interior of the vehicle?',
          answer: vehicleInterior,
          onChange: (data) => setVehicleInterior(data.value),
          options: [
            { label: 'Poor', value: 'Poor' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Good', value: 'Good' },
          ],
        }, {
          type: 'button',
          question: 'Submit',
          onChange: () => handleSubmit()
        }]}
      />
    </View>
  );
}

InspectionFeedback.propTypes = {};

InspectionFeedback.defaultProps = {};
