import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Question from './components/question';
import Overlay from './components/overlay';
import Share from 'ftc-share';


const shareInstance = new Share(document.querySelector('[data-o-component=o-share]'));//产生社交网络分享按钮

const endpoint = 'https://ft-ig-answer-api.herokuapp.com/api/v1';

class App extends Component {//类App继承了react的类Component
  constructor(props) {
    super(props);//调用父类Component的构造方法
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
    this.setQuestions = this.setQuestions.bind(this);//将该类上的方法绑定在该类上
    this.updateProgress = this.updateProgress.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  setQuestions(value) {
    console.log(`Country selected: ${value}`);
    const key = value.toLowerCase().replace(/\s/g, '-');//将value值都化为小写，并将其中的空白符都替换为'-'

    const data = `https://ft-ig-content-prod.s3.amazonaws.com/v1/ft-interactive/answer-api/2/2__perils-of-perception-survey-2016__${key}.json`;//这里是下数据的地址

    //const data = require('./questiondata/argentina.js');

    fetch(data)
    /* 知识补充：
     fetch() 方法用于发起获取资源的请求，默认方法是GET。参数data是请求的URL。它返回一个 promise，这个 promise 会在请求响应后被 resolve，并传回 Response 对象。
     */
      .then(res => res.json())
      /* 知识补充：
        response对象的方法.json():返回一个promise,resolve得到一个包含json数据的对象字面量
      */
      .then(({ questions }) => this.setState({
        /* 知识补充：
         * 此处then()的链式调用，这里的参数{questions}就是前一个then的return结果??待确认
         * setState(nextState, callback)：React.Component类的方法，
        */

        questionsLoaded: true,
        questions,
        country: value,
      }));
      
     /*
      this.setState({
        questionsLoaded: true,
        ...data,
        country: value,
      })
      */
  }

  updateProgress(n) {
    /* 用于更进做到哪一题了，
     * @param n,做到的题号数
    */
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
      .filter(question => question.answer !== '')//将questions数组返回其每个数组项的answer属性不为''的数组项
      .sort((a, b) => Number(a.meta.qid.slice(1)) - Number(b.meta.qid.slice(1)))//升序排列（应该是按题号升序排列）
      .slice(2)//从索引为2开始提取这个数组
      .map((question, i) =>//参数question:数组项，参数i:数组索引
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
    );//loadStatus 为null或 "<p><strong>问卷加载中...<\/strong><\/p>" 
      //question  为一个数组，每个数组项为"<Question ... \/>"
      // results 为null或 "<div><p>Your score: {his.state.score}<\/p><\/div>"
      // chooseQuestions=为null或 "<Overlay setQuestions={this.setQuestions} \/>"
  }
}

App.propTypes = {
  questions: React.PropTypes.array,
};



ReactDOM.render(<App />, document.querySelector('#react-container')); //对'#react-container'处元素内部进行填充
