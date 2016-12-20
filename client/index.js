import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';
import Share from 'ftc-share';
const shareInstance = new Share(document.querySelector('[data-o-component=o-share]'));

const endpoint = 'https://ft-ig-answer-api.herokuapp.com/api/v1';

class App extends Component {
  constructor(props) {
    super(props);
    const { questions } = props;

    this.state = {
      questionsLoaded: false,
      questions: [],
      activeQuestion: 0,
      score: 0,
      complete: false,
      // TODO: set chooseQuestions to true if you want the question set to be
      // selectable on page load
      chooseQuestions: true,
      country: null,
    };
    this.setQuestions = this.setQuestions.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  setQuestions(value) {
    console.log(`Country selected: ${value}`);
    const key = value.toLowerCase().replace(/\s/g, '-');
    const data = `https://ft-ig-content-prod.s3.amazonaws.com/v1/ft-interactive/answer-api/2/2__perils-of-perception-survey-2016__${key}.json`;
    // fetch(`${endpoint}/project/1?aggregate=true&key=Country&value=${value}`)
    fetch(data)
      .then(res => res.json())
      .then(({ questions }) => this.setState({
        questionsLoaded: true,
        questions,
        country: value,
      }));
  }

  updateProgress(n) {
    if (n <= this.state.questions.length - 1) {
      this.setState({ activeQuestion: n });
    } else {
      this.setState({
        activeQuestion: null,
        complete: true,
      });
    }
  }

  updateScore(n) {
    this.setState(prevState => ({
      score: prevState.score + n,
    }));
  }

  render() {
    const loadStatus = this.state.questionsLoaded ?
      null :
      <p><strong>问卷加载中...</strong></p>;

    const questions = this.state.questions
      .filter(question => question.answer !== '')
      .sort((a, b) => Number(a.meta.qid.slice(1)) - Number(b.meta.qid.slice(1)))
      .slice(2)
      .map((question, i) =>
        <Question
          key={question.meta.qid}
          questionId={question.id}
          questionIndex={i}
          questionText={question.text}
          questionType={question.meta.type}
          options={Object.keys(question.options).map(option =>
              question.options[option]
            ).filter(option => option !== null)}
          answer={Number(question.answer)}
          countryAnswer={Number(question.meta.perceived)}
          responsesData={question.responses}
          active={i === this.state.activeQuestion}
          updateProgress={this.updateProgress}
          updateScore={this.updateScore}
          endpoint={endpoint}
          country={this.state.country}
        />
      );
    const results = this.state.complete ?
      (<div>
        <p>Your score: {this.state.score}</p>
      </div>)
      : null;
    const chooseQuestions = this.state.chooseQuestions ?
      <Overlay setQuestions={this.setQuestions} />
      : null;

    return (
      <div>
        <link rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-buttons@^4.4.1" /> 

        {loadStatus}

        {questions}

        {results}

        {chooseQuestions}
      </div>
    );
  }
}

App.propTypes = {
  questions: React.PropTypes.array,
};



ReactDOM.render(<App />, document.querySelector('#react-container'));
