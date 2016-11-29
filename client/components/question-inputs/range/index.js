import React, { Component } from 'react';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.max / 2,
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
        className="range-input"
      >
        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={event => this.handleChange(event.target.value)}
          disabled={this.state.disabled}
        />

        {this.state.value}

        <input
          type="submit"
          value="Submit"
          disabled={this.state.disabled}
          className="o-buttons"
        />
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
