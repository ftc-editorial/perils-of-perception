import React, { Component } from 'react';

class MultipleChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    };
  }

  handleClick(value) {
    this.setState({
      disabled: true,
    });
    this.props.onSubmit(null, value);
  }

  render() {
    const buttons = this.props.options.map((option, i) =>
      <button
        key={`b${i}`}
        onClick={() => this.handleClick(option)}
        disabled={this.state.disabled}
      >
        {option}
      </button>
    );

    return (
      <div className="multiple-choice-input">
        {buttons}
      </div>
    );
  }
}

MultipleChoice.propTypes = {
  onSubmit: React.PropTypes.func,
  options: React.PropTypes.array,
};

export default MultipleChoice;
