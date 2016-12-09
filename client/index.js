import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // questions: [],
      questions: JSON.parse(document.getElementById('data').textContent),
      activeQuestion: 0,
      score: 0,
      complete: false,
      // TODO: set chooseQuestions to true if you want the question set to be
      // selectable on page load
      // chooseQuestions: true,
    };
    this.setQuestions = this.setQuestions.bind(this);
    this.updateProgress = this.updateProgress.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  setQuestions(value) {
    console.log(value);

    this.setState({ questions: JSON.parse(document.getElementById('data').textContent) });
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
        questionText={question.questiontext}
        questionType={question.type}
        options={Object.keys(question.options).map(option =>
          question.options[option]
        ).filter(option => option !== null)}
        answer={question.answer}
        responsesData={[48, 35, 61, 31, 34, 92, 19, 38, 26, 60, 10, 75, 23, 63, 98, 33, 72, 12, 54, 57, 96, 37, 20, 46, 14, 74, 25, 55, 32, 95, 39, 49, 18, 42, 56, 47, 62, 8, 21, 67, 45, 70, 5, 11, 2, 1, 59, 100, 58, 77, 41, 17, 71, 88, 91, 84, 76, 50, 80, 43, 87, 28, 6, 81, 22, 24, 44, 64, 40, 82, 53, 89, 16, 29, 4, 13, 51, 30, 86, 93, 7, 85, 3, 66, 78, 90, 83, 52, 73, 15, 36, 9, 68, 27, 65, 44, 47, 49, 19, 29]}
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

ReactDOM.render(<App />, document.querySelector('#react-container'));
