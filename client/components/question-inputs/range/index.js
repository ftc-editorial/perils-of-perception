import React, { Component } from 'react';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.max / 2,
      disabled: false,
    };
  }

  handleChange(inputValue) {
    const value = parseInt(inputValue, 10);
    const number = isNaN(value) ? 50 : value;

    this.setState({ value: number });
  }

  render() {
    return (
      <div className="input">
        <form
          onSubmit={event => {
            this.setState({ disabled: true });
            this.props.onSubmit(event, this.state.value);
            // TODO: comment out the line below if you don't want the submit button to fade out
            this.submitButton.style.opacity = 0;
            this.rangeInput.classList.add('hidden');
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
            ref={node => { this.rangeInput = node; }}
            type="range"
            min={this.props.min}
            max={this.props.max}
            step={1}
            value={this.state.value}
            onChange={event => this.handleChange(event.target.value)}
            disabled={this.state.disabled}
          />

          <input
            ref={node => { this.submitButton = node; }}
            type="submit"
            value="CHECK YOUR ANSWER"
            disabled={this.state.disabled}
            className="o-buttons o-buttons--standout"
          />
        </form>
        <div className="spacer" />
      </div>
    );
  }
}

Range.propTypes = {
  onSubmit: React.PropTypes.func,
  min: React.PropTypes.number,
  max: React.PropTypes.number,
};

export default Range;
