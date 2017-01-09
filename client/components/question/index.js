import React, { Component } from 'react';
import Range from '../question-inputs/range';
import ColumnChart from '../question-outputs/column-chart';

class Question extends Component {
  constructor(props) {
    super(props);

    this.state = {
      answered: false,
      // correct: false,
      value: null,
    };
    this.markQuestion = this.markQuestion.bind(this);
  }

  markQuestion(event, value) {
    // Check if user answered correctly
    // const correct = value === this.props.answer;

    // Points awarded for this question (use for weighting etc.)
    const difference = Math.abs(this.props.answer - value);
    let questionValue;

    if (event) {
      event.preventDefault();
    }

    this.setState({
      answered: true,
      value,
    });

    if (difference < 15) {
      questionValue = difference === 0 ?
        questionValue = 100 / this.props.questionsLength :
        questionValue = (100 / this.props.questionsLength) * (1 - (difference / 15));
    } else {
      questionValue = 0;
    }

    // if (correct) {
    //   this.setState({ correct });
    //   this.props.updateScore(questionValue);
    // }

    this.props.updateScore(questionValue);

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
    const activeClass = this.props.active ? ' active' : '';
    const answeredClass = this.state.answered ? ' answered' : '';
    const input = (
      <Range
        min={rangeMin}
        max={rangeMax}
        step={rangeMax / 100}
        thumbSize={28}
        onSubmit={this.markQuestion}
      />
    );
    const chart = this.state.answered && (
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
    const output = this.state.answered && (
      <div className="o-grid-container">
        <div className="o-grid-row">
          <div data-o-grid-colspan="12 M4">
            <div className="legend">
              <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="5" className="legend-actual" />
              </svg>
              <p className="o-typography-lead--small">实际情况</p>
            </div>
            <p>
              答案是 <strong>{this.props.answer}&#37;</strong>.
            </p>
          </div>
          <div data-o-grid-colspan="12 M4">
            <div className="legend">
              <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="5" className="legend-user" />
              </svg>
              <p className="o-typography-lead--small">你的回答</p>
            </div>
            <p>
              你认为是 <strong>{this.state.value}&#37;</strong>.
            </p>
          </div>
          <div data-o-grid-colspan="12 M4">
            <div className="legend">
              <svg width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="5" className="legend-country" />
              </svg>
              <p className="o-typography-lead--small">{this.props.country} 问卷结果</p>
            </div>
            <p>
              调查民众答案 <strong>{this.props.countryAnswer}&#37;</strong>.
            </p>
          </div>
        </div>
      </div>
    );
    const crossheadLookup = {
      19: '当前穆斯林人口',
      20: '未来穆斯林人口',
      21: '健康保险支出',
      22: '拥有房产的比例',
      23: '财富分配',
      24: '幸福感',
      26: '对堕胎的态度',
      27: '对同性恋的态度',
      28: '对婚前性行为的态度',
    };
    const crosshead = crossheadLookup[this.props.questionId];

    return (
      <div
        ref={node => { this.node = node; }}
        className={`question${activeClass}${answeredClass}`}
      >
        <h2 className="o-typography-subhead--crosshead">
          {this.props.questionIndex + 1}. {crosshead}
        </h2>

        <p className="o-typography-lead--small">
          {this.props.questionText}
        </p>

        {input}

        {/* TODO: comment out the line below if you don't want a chart output */}
        {chart}

        {output}
      </div>
    );
  }
}

Question.propTypes = {
  questionId: React.PropTypes.number,
  questionIndex: React.PropTypes.number,
  active: React.PropTypes.bool,
  questionType: React.PropTypes.string,
  questionText: React.PropTypes.string,
  options: React.PropTypes.array,
  answer: React.PropTypes.any,
  countryAnswer: React.PropTypes.number,
  responsesData: React.PropTypes.object,
  updateProgress: React.PropTypes.func,
  updateScore: React.PropTypes.func,
  endpoint: React.PropTypes.string,
  country: React.PropTypes.string,
  questionsLength: React.PropTypes.number,
};

export default Question;
