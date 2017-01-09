import React, { Component } from 'react';
const countries = require('../../../data/countries.js')

class Overlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputsDisabled: false,
      visibility: '',
      value: 'China',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    this.props.setQuestions(this.state.value);

    this.modal.classList.add('animate-blur');
    this.modal.style.backgroundColor = 'rgba(51, 51, 51, 0)';

    setInterval(
      () => this.setState({
        inputsDisabled: true,
        visibility: 'hidden',
      }), 250
    );
  }

  render() {
    const options = countries;

    const selectOptions = options.map((option, i) =>
      <option
        key={`o${i}`}
        value={option.en}
      >
        {option.cn}
      </option>
    );

    return (
      <div
        ref={node => { this.modal = node; }}
        className={`overlay ${this.state.visibility}`.trim()}
      >
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12">
              <header className="overlay-header">
                测验：你有多了解全球?
              </header>

              <section className="overlay-content">
                <p>选择你想测试的国家或地区</p>

                <form
                  onSubmit={(event, value) => {
                    this.handleSubmit(event, value);
                  }}
                >
                  <select
                    value={this.state.value}
                    onChange={this.handleChange}
                    required
                  >
                    {selectOptions}
                  </select>

                  <input
                    type="submit"
                    value="开始测验"
                    className="o-buttons o-buttons--big o-buttons--standout"
                    disabled={this.state.inputsDisabled}
                  />
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Overlay.propTypes = {
  setQuestions: React.PropTypes.func,
};

export default Overlay;
