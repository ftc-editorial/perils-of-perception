import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';

const endpoint = 'http://localhost:5353/api/v1/project/1?aggregate=true';

class App extends Component {
  constructor(props) {
    super(props);
    const { questions } = props;

    this.state = {
      questions,
      activeQuestion: 0,
      score: 0,
      complete: false,
      // TODO: set chooseQuestions to true if you want the question set to be
      // selectable on page load
      chooseQuestions: true,
    };
    this.setQuestions = this.setQuestions.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  setQuestions(value) {
    console.log(`Country selected: ${value}`);
    fetch(`${endpoint}&key=Country&value=${value}`).then(res => res.json())
    .then(({ questions }) => this.setState({ questions }));
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
    const questions = this.state.questions.map((question, i) =>
      <Question
        key={question.id}
        questionIndex={i}
        questionText={question.text}
        questionType={question.meta.type}
        options={Object.keys(question.options).filter(option => option).map(option =>
          question.options[option]
        )}
        answer={question.answer}
        responsesData={Object.values(question.responses)}
        active={i === this.state.activeQuestion}
        updateProgress={this.updateProgress}
        updateScore={this.updateScore}
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

fetch(endpoint)
  .then(res => res.json())
  .then(({ questions }) => {
    ReactDOM.render(<App questions={questions} />, document.querySelector('#react-container'));
  });
