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
      questionsLength: 0,
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
    const data = `en/${key}.json`;

    fetch(data)
      .then(res => res.json())
      .then(({ questions }) => this.setState({
        questionsLoaded: true,
        questions,
        country: value,
        questionsLength: questions
          .filter(question => question.answer !== '')
          .sort((a, b) => Number(a.meta.qid.slice(1)) - Number(b.meta.qid.slice(1)))
          .slice(2)
          .length,
      }));
  }

  updateProgress(n) {
    if (n < this.state.questionsLength) {
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
          questionsLength={this.state.questionsLength}
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

        <a
          href={`https://twitter.com/intent/tweet?text=How%20well%20do%20you%20really%20know%20your%20country%3F%20My%20${this.state.country}%20rating%20was%20${Math.round(this.state.score)}%25%3B%20see%20how%20you%20compare%3A&url=https%3A%2F%2Fig.ft.com%2Fsites%2Fquiz%2Fperils-of-perception%2F2016%2F&via=FT`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="o-buttons o-buttons--big o-buttons--standout"
          >
            Tweet Your Rating
          </button>
        </a>
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
