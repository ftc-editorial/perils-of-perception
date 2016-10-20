import React from 'react';

// This will need to be a class-based component with state (answered, correct etc.)
const QuizQuestion = ({ question, questionNumber }) =>
  <div>
    <h2>Question {questionNumber}</h2>
    <p>{question}</p>
    <p>[Answer input]</p>
  </div>;

QuizQuestion.propTypes = {
  question: React.PropTypes.string,
};

export default QuizQuestion;
