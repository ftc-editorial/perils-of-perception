import React, { Component } from 'react';

class MultipleChoice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
      disabled: false,
    };
  }

  handleClick(value) {
    this.setState({
      value,
      disabled: true,
    });
    this.props.onSubmit(null, this.state.value);

    console.log(value);
  }

  render() {
    const buttons = this.props.options.map((option, i) =>
      <button
        key={`b${i}`}
        // value={i}
        onClick={() => this.handleClick(i)}
        disabled={this.state.disabled}
      >
        {option}
      </button>
    );

    return (
      <div>
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
