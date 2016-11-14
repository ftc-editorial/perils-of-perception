import React, { Component } from 'react';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.max / 2,
    };
  }

  handleChange(value) {
    this.setState({ value: parseInt(value, 10) });
  }

  render() {
    return (
      <form onSubmit={event => this.props.onSubmit(event, this.state.value, this.props.answer)}>
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={event => this.handleChange(event.target.value)}
          className="quiz-slider"
        />

        {this.state.value}

        <input type="submit" value="submit" />
      </form>
    );
  }
}

Range.propTypes = {
  onSubmit: React.PropTypes.func,
  answer: React.PropTypes.number,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
};

export default Range;
