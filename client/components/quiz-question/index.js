import React, { Component } from 'react';
import MultipleChoice from '../quiz-inputs/multiple-choice';
import Range from '../quiz-inputs/range';

class QuizQuestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answered: false,
      correct: false,
    };
    this.markQuestion = this.markQuestion.bind(this);
  }

  markQuestion(event, value) {
    if (event) {
      event.preventDefault();
    }

    console.log(value);

    // Check if user answered correctly
    const correct = value === this.props.answer;
    // Points awarded for this question (use for weighting etc.)
    const questionValue = 1;

    this.setState({
      answered: true,
    });

    if (correct) {
      this.setState({ correct });
      this.props.updateScore(questionValue);
    }

    this.props.updateActiveQuestion();
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
      : <MultipleChoice
        options={this.props.options}
        onSubmit={this.markQuestion}
      />;
    const active = this.props.active ? ' active' : '';
    const answered = this.state.answered ? ' answered' : '';
    let output;

    if (this.state.answered) {
      output = this.state.correct ? <p>Correct</p> : <p>Incorrect</p>;
    }

    return (
      <div className={`quiz-question${active}${answered}`}>
        <h2>Question {this.props.questionNumber}</h2>

        <p>{this.props.questionText}</p>

        {input}

        {output}
      </div>
    );
  }
}

QuizQuestion.propTypes = {
  answer: React.PropTypes.any,
  updateActiveQuestion: React.PropTypes.func,
  updateScore: React.PropTypes.func,
  options: React.PropTypes.array,
  questionType: React.PropTypes.string,
  active: React.PropTypes.bool,
  questionNumber: React.PropTypes.number,
  questionText: React.PropTypes.string,
};

export default QuizQuestion;
