import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import QuizQuestion from './components/quiz-question';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { questions: JSON.parse(document.getElementById('data').textContent) };
  }

  render() {
    const quizQuestions = this.state.questions.map((question, i) =>
      <QuizQuestion
        key={question.id}
        questionNumber={i + 1}
        questionText={question.question}
        questionType={question.type}
      />
    );

    // if (!quizQuestions) {
    //   return <div>Loading…</div>;
    // }

    return (
      <div>
        <h1>Quiz app</h1>

        <p>This quiz has {quizQuestions.length} questions.</p>
        {quizQuestions}
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#react-container')
);
