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
          this.setState({ disabled: true });
          this.submitButton.style.opacity = 0;
          this.props.onSubmit(event, this.state.value);
        }}
        className="range-input"
      >
        <div className="range-labels">
          <div className="range-labels-min">
            {this.props.min}
          </div>
          <div className="range-labels-input">
            {this.state.value}
          </div>
          <div className="range-labels-max">
            {this.props.max}
          </div>
        </div>

        <input
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={event => this.handleChange(event.target.value)}
          disabled={this.state.disabled}
        />

        <div
          className="button-container"
        >
          <input
            ref={node => { this.submitButton = node; }}
            type="submit"
            value="Submit"
            disabled={this.state.disabled}
            className="o-buttons"
          />
        </div>
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
