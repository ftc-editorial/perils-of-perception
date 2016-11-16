import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuizQuestion from './components/quiz-question';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: JSON.parse(document.getElementById('data').textContent),
      activeQuestion: 0,
    };
    this.updateActiveQuestion = this.updateActiveQuestion.bind(this);
  }

  updateActiveQuestion() {
    this.setState(prevState => ({
      activeQuestion: prevState.activeQuestion + 1,
    }));
  }

  render() {
    const quizQuestions = this.state.questions.map((question, i) =>
      <QuizQuestion
        key={question.id}
        questionNumber={i + 1}
        questionText={question.questiontext}
        questionType={question.type}
        options={Object.keys(question.options).map(option => {
          if (question.options[option] !== null) {
            return question.options[option];
          }

          return null;
        }).filter(option => option !== null)}
        answer={question.answer}
        active={i === this.state.activeQuestion}
        updateActiveQuestion={this.updateActiveQuestion}
      />
    );

    return (
      <div>
        <h1>Quiz app</h1>

        <p>This quiz has {quizQuestions.length} questions.</p>

        {quizQuestions}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#react-container'));
