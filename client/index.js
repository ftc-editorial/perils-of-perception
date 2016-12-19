import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';

const endpoint = 'https://ft-ig-answer-api.herokuapp.com/api/v1';

class App extends Component {
  constructor(props) {
    super(props);
    const { questions } = props; // eslint-disable-line

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
    const key = value.toLowerCase().replace(/\s/g, '-');
    const data = `https://ft-ig-content-prod.s3.amazonaws.com/v1/ft-interactive/answer-api/2/2__perils-of-perception-survey-2016__${key}.json`;

    fetch(data)
      .then(res => res.json())
      .then(({ questions }) => this.setState({
        questionsLoaded: true,
        questions,
        country: value,
      }));
  }

  updateProgress(n) {
    if (n <= this.state.questions.length - 3) {
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
    const chooseQuestions = this.state.chooseQuestions && (
      <Overlay setQuestions={this.setQuestions} />
    );
    const loadStatus = !this.state.questionsLoaded && <p><strong>Loading quiz…</strong></p>;
    const questions = this.state.questions
      .filter(question => question.answer !== '')
      .sort((a, b) => Number(a.meta.qid.slice(1)) - Number(b.meta.qid.slice(1)))
      .slice(2)
      .map((question, i) =>
        <Question
          key={question.meta.qid}
          questionId={question.id}
          questionIndex={i}
          active={i === this.state.activeQuestion}
          questionType={question.meta.type}
          questionText={question.text}
          options={Object.keys(question.options).map(option =>
              question.options[option]
            ).filter(option => option !== null)}
          answer={Number(question.answer)}
          countryAnswer={Number(question.meta.perceived)}
          responsesData={question.responses}
          updateProgress={this.updateProgress}
          updateScore={this.updateScore}
          endpoint={endpoint}
          country={this.state.country}
          questionsLength={this.state.questions.length - 2}
        />
      );
    let feedback;

    switch (true) {
      case this.state.score >= 70:
        feedback = ' – definite native!';
        break;
      default:
        feedback = '';
    }

    const results = this.state.complete && (
      <div
        className="results"
      >
        <h2>Your overall rating: {Math.round(this.state.score)}&#37;{feedback}</h2>

        <button className="o-buttons o-buttons--big o-buttons--standout">Tweet Your Score</button>
      </div>
    );

    return (
      <div>
        <link rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-buttons@^4.4.1" />

        {chooseQuestions}

        {loadStatus}

        {questions}

        {results}
      </div>
    );
  }
}

App.propTypes = {
  questions: React.PropTypes.array,
};

ReactDOM.render(<App />, document.getElementById('react-container'));
