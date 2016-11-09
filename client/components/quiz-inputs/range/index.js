import React, { Component } from 'react';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.max / 2,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={this.handleChange}
          className="quiz-slider"
        />
        {this.state.value}
        <input type="submit" value="submit" />
      </form>
    );
  }
}

Range.propTypes = {
  min: React.PropTypes.number,
  max: React.PropTypes.number,
};

export default Range;
