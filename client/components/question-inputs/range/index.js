import React, { Component } from 'react';
import throttle from 'lodash/throttle';

class Range extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.max / 2,
      rangeDisabled: false,
      submitDisabled: true,
      width: null,
      increment: null,
      rangeProgress: 50,
      rangeOverlayPosition: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    const component = this;

    this.handleResize();

    function setInitialValue() {
      const value = Math.floor(component.state.rangeProgress * (component.props.max / 100));

      component.setState({ value });
    }

    setInitialValue();
    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 750));
  }

  handleChange(value) {
    const inputValue = parseInt(value, 10);
    const number = isNaN(inputValue) ? this.props.max / 2 : inputValue;
    const rangeProgress = Math.round(100 / (this.props.max / number));
    const increment = (this.state.width - this.props.thumbSize) / 100;
    const rangeOverlayPosition = (rangeProgress * increment) - 6;

    this.setState({
      value: number,
      submitDisabled: false,
      rangeProgress,
      rangeOverlayPosition,
    });
  }

  handleResize() {
    const width = this.rangeInput.offsetWidth;
    // const thumbSize = 28; // Make sure this matches the thumb styling in ./_main.scss
    const increment = (width - this.props.thumbSize) / 100;
    const rangeOverlayPosition = (this.state.rangeProgress * increment) - 6;

    this.setState({
      width,
      rangeOverlayPosition,
    });
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
            this.rangeLabels.classList.add('hidden');
          }}
          className="range-input"
        >
          <div
            ref={node => { this.rangeLabels = node; }}
            className="range-labels"
          >
            <div className="range-labels-min">
              {this.props.min}
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
            step={this.props.step}
            value={this.state.value}
            onChange={event => this.handleChange(event.target.value)}
            disabled={this.state.rangeDisabled}
          />

          <output
            style={{ left: this.state.rangeOverlayPosition }}
          >
            {this.state.value}
          </output>

          <input
            ref={node => { this.submitButton = node; }}
            type="submit"
            value="CHECK YOUR ANSWER"
            disabled={this.state.submitDisabled}
            className="o-buttons o-buttons--big o-buttons--standout"
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
  step: React.PropTypes.number,
  thumbSize: React.PropTypes.number,
};

export default Range;
