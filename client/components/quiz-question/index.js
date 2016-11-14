import React, { Component } from 'react';
import MultipleChoice from '../quiz-inputs/multiple-choice';
import Range from '../quiz-inputs/range';

function markQuestion(value, answer) {
  const correct = value === answer;

  if (correct) {
    console.log('Correct');
  } else {
    console.log('Wrong');
  }
}

class QuizQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnswered: false,
      score: 0,
    };
  }

  handleSubmit(event, value, answer) {
    event.preventDefault();

    markQuestion(value, answer);
  }

  render() {
    const rangeMin = this.props.options[0];
    const rangeMax = this.props.options[1];
    const answer = this.props.answer;
    const input = this.props.questionType === 'range'
      ? <Range
        min={rangeMin}
        max={rangeMax}
        answer={answer}
        onSubmit={this.handleSubmit}
      />
      : <MultipleChoice />;

    return (
      <div>
        <h2>Question {this.props.questionNumber}</h2>

        <p>{this.props.questionText}</p>

        {input}
      </div>
    );
  }
}

QuizQuestion.propTypes = {
  options: React.PropTypes.array,
  answer: React.PropTypes.any,
  questionType: React.PropTypes.string,
  questionNumber: React.PropTypes.number,
  questionText: React.PropTypes.string,
};

export default QuizQuestion;
