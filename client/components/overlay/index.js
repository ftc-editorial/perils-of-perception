import React, { Component } from 'react';

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
    const options = [
      'Argentina',
      'Australia',
      'Belgium',
      'Brazil',
      'Canada',
      'Chile',
      'China',
      'Colombia',
      'Czech Republic',
      'Denmark',
      'France',
      'Germany',
      'Great Britain',
      'Hong Kong',
      'Hungary',
      'India',
      'Indonesia',
      'Israel',
      'Italy',
      'Japan',
      'Malaysia',
      'Mexico',
      'Montenegro',
      'Netherlands',
      'Norway',
      'Peru',
      'Philippines',
      'Poland',
      'Russia',
      'Serbia',
      'Singapore',
      'South Africa',
      'South Korea',
      'Spain',
      'Sweden',
      'Taiwan',
      'Thailand',
      'Turkey',
      'United Kingdom',
      'United States',
      'Vietnam',
    ];

    const selectOptions = options.map((option, i) => {
      // const key = Object.keys(option)[0];
      // const value = option[key];
      return (
        <option
          key={`o${i}`}
          value={option}
        >
          {option}
        </option>
      );
    });

    return (
      <div
        ref={node => { this.modal = node; }}
        className={`overlay ${this.state.visibility}`.trim()}
      >
        <div className="o-grid-container">
          <div className="o-grid-row">
            <div data-o-grid-colspan="12">
              <header className="overlay-header">
                你真的了解你的国家吗？
              </header>
              <section className="overlay-content">
                <p>你想做关于哪个国家的问卷？</p>

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
                    value="开始答题"
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
