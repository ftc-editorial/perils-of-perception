import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: JSON.parse(document.getElementById('data').textContent),
      activeQuestion: 0,
      score: 0,
      complete: false,
    };
    this.updateProgress = this.updateProgress.bind(this);
    this.updateScore = this.updateScore.bind(this);
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
        responsesData={[10, 0, 50, 100, 25]}
        active={i === this.state.activeQuestion}
        updateProgress={this.updateProgress}
        updateScore={this.updateScore}
      />
    );
    const results = this.state.complete
      ? <div>
        <p>Your score: {this.state.score}</p>
      </div>
      : null;

    return (
      <div>
        <link rel="stylesheet" href="https://build.origami.ft.com/v2/bundles/css?modules=o-buttons@^4.4.1" />
        <h1>Quiz app</h1>

        <p>This quiz has {questions.length} questions.</p>

        {questions}

        {results}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#react-container'));
