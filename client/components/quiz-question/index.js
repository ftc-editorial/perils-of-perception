import React from 'react';
import MultipleChoice from '../quiz-inputs/multiple-choice';
import Range from '../quiz-inputs/range';

// This will need to be a class-based component with state (answered, correct etc.)
const QuizQuestion = ({ questionNumber, questionText, questionType, options }) => {
  const rangeMin = options[0];
  const rangeMax = options[1];
  const input = questionType === 'range' ? <Range min={rangeMin} max={rangeMax} />
    : <MultipleChoice />;

  return (
    <div>
      <h2>Question {questionNumber}</h2>

      <p>{questionText}</p>

      {input}
    </div>
  );
};

QuizQuestion.propTypes = {
  questionNumber: React.PropTypes.number,
  questionText: React.PropTypes.string,
  questionType: React.PropTypes.string,
  options: React.PropTypes.array,
};

export default QuizQuestion;
