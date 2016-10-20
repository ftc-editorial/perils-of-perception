import React from 'react';

// This will need to be a class-based component with state (answered, correct etc.)
const QuizQuestion = ({ question }) =>
  <p>{question}</p>;

QuizQuestion.propTypes = {
  question: React.PropTypes.string,
};

export default QuizQuestion;
