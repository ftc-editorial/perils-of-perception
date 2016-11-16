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
      this.setState({ score: 1 });
      console.log('Correct');
    } else {
      console.log('Incorrect');
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
    const active = this.props.active ? ' active' : '';

    return (
      <div className={`quiz-question${active}`}>
        <h2>Question {this.props.questionNumber}</h2>

        <p>{this.props.questionText}</p>

        {input}
      </div>
    );
  }
}

QuizQuestion.propTypes = {
  answer: React.PropTypes.any,
  options: React.PropTypes.array,
  questionType: React.PropTypes.string,
  active: React.PropTypes.bool,
  questionNumber: React.PropTypes.number,
  questionText: React.PropTypes.string,
};

export default QuizQuestion;
