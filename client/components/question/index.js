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

    // POST response to server
    fetch(`${this.props.endpoint}/response/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        submitted: Date.now(),
        questionId: this.props.questionId,
        meta: {
          Country: this.props.country,
        },
      }),
    }).then(res => console.log(res)).catch(e => console.error(e));

    this.props.updateProgress(this.props.questionIndex + 1);
  }

  render() {
    const rangeMin = this.props.options[0];
    const rangeMax = this.props.options[1];
    const active = this.props.active ? ' active' : '';
    const answered = this.state.answered ? ' answered' : '';
    let output;
    let chart;

    const input = (<Range
      min={rangeMin}
      max={rangeMax}
      step={rangeMax / 100}
      thumbSize={28}
      onSubmit={this.markQuestion}
    />);

    if (this.state.answered) {
      chart = (
        <ColumnChart
          data={this.props.responsesData}
          initialWidth={this.node.offsetWidth}
          inputMin={rangeMin}
          inputMax={rangeMax}
          // units={this.props.meta.units}
          userAnswer={this.state.value}
          actualAnswer={this.props.answer}
          countryAnswer={this.props.countryAnswer}
        />
      );

      output = (
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12 M4">
              <div className="legend">
                <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" className="legend-actual" />
                </svg>
                <p className="o-typography-lead--small">Actual answer</p>
              </div>
              <p>
                The actual answer is <strong>xyz&#37;</strong>.
              </p>
            </div>
            <div data-o-grid-colspan="12 M4">
              <div className="legend">
                <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" className="legend-user" />
                </svg>
                <p className="o-typography-lead--small">Your answer</p>
              </div>
              <p>
                Your guess was <strong>{this.state.value}&#37;</strong>.
              </p>
            </div>
            <div data-o-grid-colspan="12 M4">
              <div className="legend">
                <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="5" cy="5" r="5" className="legend-country" />
                </svg>
                <p className="o-typography-lead--small">{this.props.country} answer</p>
              </div>
              <p>
                People in {this.props.country} answered <strong>xyz&#37;</strong>.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={node => { this.node = node; }}
        className={`question${active}${answered}`}
      >
        <h2 className="o-typography-subhead--crosshead">
          Question {this.props.questionIndex + 1}
        </h2>

        <p className="o-typography-lead--small">“{this.props.questionText}”</p>

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
  responsesData: React.PropTypes.object,
  questionIndex: React.PropTypes.number,
  questionText: React.PropTypes.string,
  endpoint: React.PropTypes.string,
  country: React.PropTypes.string,
  questionId: React.PropTypes.number,
  meta: React.PropTypes.object,
};

export default Question;
