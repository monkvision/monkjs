import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import BuildQuestion from '../BuildQuestion';

export default function Feedback({ questions }) {
  return (
    questions.map((question, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <View style={{ marginBottom: 10 }} key={`${question.type}-${index}`}>
        <BuildQuestion
          type={question.type}
          question={question.question}
          answer={question.answer}
          options={question.options}
          onChange={question.onChange}
          config={question.config}
          {...question.inputProps}
        />
      </View>
    ))
  );
}

Feedback.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    answer: PropTypes.any,
    config: PropTypes.object,
    inputProps: PropTypes.object,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })),
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })),
};

Feedback.defaultProps = {
  questions: [],
};
