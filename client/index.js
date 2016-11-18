import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuizQuestion from './components/quiz-question';

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
    const quizQuestions = this.state.questions.map((question, i) =>
      <QuizQuestion
        key={question.id}
        questionIndex={i}
        questionText={question.questiontext}
        questionType={question.type}
        options={Object.keys(question.options).map(option =>
          question.options[option]
        ).filter(option => option !== null)}
        answer={question.answer}
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
        <h1>Quiz app</h1>

        <p>This quiz has {quizQuestions.length} questions.</p>

        {quizQuestions}

        {results}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#react-container'));
