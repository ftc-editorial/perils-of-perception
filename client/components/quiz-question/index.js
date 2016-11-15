import React, { Component } from 'react';
import MultipleChoice from '../quiz-inputs/multiple-choice';
import Range from '../quiz-inputs/range';

class QuizQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnswered: false,
      score: 0,
    };
    this.markQuestion = this.markQuestion.bind(this);
  }

  markQuestion(event, value) {
    event.preventDefault();

    const correct = value === this.props.answer;

    this.setState({ isAnswered: true });

    if (correct) {
      console.log('Correct');
    } else {
      console.log('Wrong');
    }
  }

  render() {
    const rangeMin = this.props.options[0];
    const rangeMax = this.props.options[1];
    const input = this.props.questionType === 'range'
      ? <Range
        min={rangeMin}
        max={rangeMax}
        onSubmit={this.markQuestion}
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
