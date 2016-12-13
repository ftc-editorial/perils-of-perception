import React, { Component } from 'react';
import MultipleChoice from '../question-inputs/multiple-choice';
import Range from '../question-inputs/range';
// import AreaChart from '../question-outputs/area-chart';
import ColumnChart from '../question-outputs/column-chart';

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answered: false,
      correct: false,
      value: null,
    };
    this.markQuestion = this.markQuestion.bind(this);
  }

  markQuestion(event, value) {
    if (event) {
      event.preventDefault();
    }

    // Check if user answered correctly
    const correct = value === this.props.answer;

    // Points awarded for this question (use for weighting etc.)
    const questionValue = 1;

    this.setState({
      answered: true,
      value,
    });

    if (correct) {
      this.setState({ correct });
      this.props.updateScore(questionValue);
    }

    this.props.updateProgress(this.props.questionIndex + 1);
  }

  render() {
    const rangeMin = this.props.options[0];
    const rangeMax = this.props.options[1];
    const active = this.props.active ? ' active' : '';
    const answered = this.state.answered ? ' answered' : '';
    let input;
    let output;
    let chart;

    if (this.props.questionType === 'range') {
      input = (<Range
        min={rangeMin}
        max={rangeMax}
        step={rangeMax / 100}
        thumbSize={28}
        onSubmit={this.markQuestion}
      />);
    } else {
      input = (<MultipleChoice
        options={this.props.options}
        onSubmit={this.markQuestion}
      />);
    }

    if (this.state.answered) {
      chart = (
        <ColumnChart
          data={this.props.responsesData}
          initialWidth={this.node.offsetWidth}
          inputMin={rangeMin}
          inputMax={rangeMax}
          userAnswer={this.state.value}
          actualAnswer={this.props.answer}
          countryAnswer={this.props.countryAnswer}
        />
      );

      output = this.state.correct
        ? (<div className="output-container">
          <p className="o-typography-lead--small">Correct</p>
        </div>)
        : (<div className="output-container">
          <p className="o-typography-lead--small">Incorrect</p>
        </div>);
    }

    return (
      <div
        ref={node => { this.node = node; }}
        className={`question${active}${answered}`}
      >
        <h2 className="o-typography-subhead--crosshead">
          Question {this.props.questionIndex + 1}
        </h2>

        <p className="o-typography-lead--small">{this.props.questionText}</p>

        {input}

        {/* TODO: comment out the line below if you don't want a chart output */}
        {chart}

        {output}
      </div>
    );
  }
}

Question.propTypes = {
  answer: React.PropTypes.any,
  countryAnswer: React.PropTypes.any,
  updateProgress: React.PropTypes.func,
  updateScore: React.PropTypes.func,
  options: React.PropTypes.array,
  questionType: React.PropTypes.string,
  active: React.PropTypes.bool,
  responsesData: React.PropTypes.array,
  questionIndex: React.PropTypes.number,
  questionText: React.PropTypes.string,
};

export default Question;
