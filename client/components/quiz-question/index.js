import React from 'react';
import MultipleChoice from '../quiz-inputs/multiple-choice'

// This will need to be a class-based component with state (answered, correct etc.)
const QuizQuestion = ({ questionNumber, questionText }) =>
  <div>
    <h2>Question {questionNumber}</h2>
    <p>{questionText}</p>
    <MultipleChoice />
  </div>;

QuizQuestion.propTypes = {
  questionNumber: React.PropTypes.number,
  questionText: React.PropTypes.string,
};

export default QuizQuestion;
