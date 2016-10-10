/*
  TODO: delete this comment

  This file is where you bootstrap your JS code
  For example import stuff here:

  import {select} from 'd3-selection';
  import myComponent from './components/my-component';

  Split logical parts of you project into components e.g.

  /client
    - /components
        - /component-name
            - styles.scss
            - index.js
            - template.html

*/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Quiz extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <p>TK Quiz app TK</p>
    );
  }
}

ReactDOM.render(
  <Quiz />,
  document.querySelector('#react-container')
);
