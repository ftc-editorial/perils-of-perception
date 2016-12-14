import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';

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

    // fetch(`${endpoint}/project/1?aggregate=true&key=Country&value=${value}`)
    fetch(`${endpoint}/project/1?aggregate=true`)
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
      <p style={{ textAlign: 'center' }}>Loading quiz…</p>;

    const questions = this.state.questions.map((question, i) =>
      <Question
        key={question.meta.id}
        questionId={question.id}
        questionIndex={i}
        questionText={question.text}
        questionType={question.meta.type}
        options={Object.keys(question.options).map(option =>
          question.options[option]
        ).filter(option => option !== null)}
        answer={question.answer}
        countryAnswer={50}
        responsesData={Object.values(question.responses)}
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
