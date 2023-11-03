---
id: feedback
title: "🧿 Feedback"
slug: /feedback
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/inspection-report/latest.svg)

# Package Overview

The Feedback package allows users to create a feedback page with different input controls such as free text, radio buttons, single / multi selection and button components.

# Implementation Guide
## Installation

To install the package simply run the following command in your project :

```bash
yarn add @monkvision/feedback
```

## Basic Usage
The `Feedback` component exported by the package is a single page component that will automatically display the entire form with all the questions assigned to the component. It takes only one parameter which is `questions` which will be an array of all the questions. The component will create an form using an `BuildQuestion` component.

Here is a minimal working example :

```javascript
import React, { useState } from 'react';
import { Feedback } from '@monkvision/feedback';

export default function InspectionFeedback() {
  const [interior, setInterior] = useState('');
  const [windShieldCondition, setWindShieldCondition] = useState('');
  const [tireCondition, setTireCondition] = useState('');
  const [tireConditionSingleSelect, setTireConditionSingleSelect] = useState('');
  const [tireConditionMultiSelect, setTireConditionMultiSelect] = useState([]);
  const [vehicleInterior, setVehicleInterior] = useState('');

  const handleSubmit = useCallback(() => {
    // Further logic will be implemented here
  }, [
    interior,
    windShieldCondition,
    tireCondition,
    tireConditionSingleSelect,
    tireConditionMultiSelect,
    vehicleInterior
  ]);

  return (
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
  );
}
```

# API
## Components
### Feedback
#### Description
```javascript
import { Feedback } from '@monkvision/feedback';
```

This component is a single page component that uses `BuildQuestion` component to create an form.

#### Props
| Prop                      | Type              | Description                                                                                                                                                            | Required | Default Value |
|---------------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| `questions.answer`            | `any`          | The answer for the question. Which can be string, number, boolean, object.                                                                                                                                    | ✔        |               |
| `questions.config`            | `object`          | The configuration for inputs such as `isMulti`.                                                                                                                                    | ✔        |               |
| `questions.inputProps`            | `any`          | Any other configuration which can be supported by an input as it's going to override the default behaviour.                                                                                                                                    | ✔        |               |
| `questions.onChange`            | `Function`          | A callback of change input data.                                                                                                                                    | ✔        | () => {}              |
| `questions.question`            | `string`          | The label for the question.                                                                                                                                    | ✔        |               |
| `questions.type`            | `string`          | The type of inputs which can be one of `radio`, `text`, `select`, `button`.                                                                                                                                    | ✔        |               |
| `questions.options`            | `object`          | The list of options available for radio and select inputs.                                                                                                                                    | ✔        |               |

### Feedback
#### BuildQuestion
```javascript
import BuildQuestion from '../BuildQuestion';

<BuildQuestion
  type={question.type}
  question={question.question}
  answer={question.answer}
  options={question.options}
  onChange={question.onChange}
  config={question.config}
  {...question.inputProps}
/>
```

This component is a question builder which helps to create / build input components. All the props are same as passed in feedback component.
