import React, { Component } from 'react';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.max / 2,
      disabled: false,
    };
  }

  handleChange(value) {
    this.setState({ value: parseInt(value, 10) });
  }

  render() {
    return (
      <form
        onSubmit={event => {
          this.props.onSubmit(event, this.state.value);

          this.setState({ disabled: true });
        }}
      >
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={event => this.handleChange(event.target.value)}
          className="quiz-slider"
          disabled={this.state.disabled}
        />

        {this.state.value}

        <input type="submit" value="submit" disabled={this.state.disabled} />
      </form>
    );
  }
}

Range.propTypes = {
  onSubmit: React.PropTypes.func,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
};

export default Range;
