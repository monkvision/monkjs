import PropTypes from 'prop-types';
import React from 'react';
import {
  FreeTextInput,
  RadioInput,
  SelectInput,
  TextButton,
} from '../common';

export default function BuildQuestion({
  type,
  question,
  answer,
  options,
  onChange,
  config,
  inputProps,
}) {
  return (
    <>
      {
        type === 'text' && (
          <FreeTextInput
            {...inputProps}
            config={config}
            label={question}
            onChange={onChange}
            value={answer}
          />
        )
      }
      {
        type === 'radio' && (
          <RadioInput
            config={config}
            label={question}
            onChange={onChange}
            options={options}
            value={answer}
          />
        )
      }
      {
        type === 'select' && (
          <SelectInput
            config={config}
            label={question}
            onChange={onChange}
            options={options}
            value={answer}
          />
        )
      }
      {
        type === 'button' && (
          <TextButton label={question} onPress={onChange} />
        )
      }
    </>
  );
}

BuildQuestion.propTypes = {
  answer: PropTypes.any,
  config: PropTypes.shape({
    isMulti: PropTypes.bool,
  }),
  inputProps: PropTypes.object,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  })),
  question: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

BuildQuestion.defaultProps = {
  answer: '',
  onChange: () => { },
  config: {
    isMulti: false,
  },
  inputProps: {},
  options: [],
};
