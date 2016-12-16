import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import throttle from 'lodash/throttle';
import d3 from 'd3';

class ColumnChart extends Component {
  constructor(props) {
    super(props);
    // Calculate height at 16:9 aspect ratio
    const calculatedHeight = (this.props.initialWidth / 3.2) + 14;
    // Make sure height is never less than n
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.state = {
      width: this.props.initialWidth,
      height,
      // Placeholder content displayed before chart render
      chart: 'Loading chart…',
    };
    this.redrawChart = this.redrawChart.bind(this);
    this.handleResize = this.handleResize.bind(this);

    for (const mixin in ReactFauxDOM.mixins.anim) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.anim, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.anim[mixin].bind(this);
      }
    }

    for (const mixin in ReactFauxDOM.mixins.core) { // eslint-disable-line
      if ({}.hasOwnProperty.call(ReactFauxDOM.mixins.core, mixin)) {
        this[mixin] = ReactFauxDOM.mixins.core[mixin].bind(this);
      }
    }
  }

  componentDidMount() {
    // Create a faux SVG and store its virtual DOM in state.chart
    const chart = this.connectFauxDOM('svg', 'chart');
    // Get chart data off component props
    const total = Object.keys(this.props.data)
      .reduce((sum, key) => sum + Number(this.props.data[key]), 0);
    const data = Object.keys(this.props.data).reduce((last, curr) => {
      last[curr] = (this.props.data[curr] / total) * 100; // eslint-disable-line
      return last;
    }, []) || Array(100);
    // Run some D3 on the faux SVG
    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 28,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 14;
    const yDomainMax = (5 * Math.ceil(d3.max(data) / 5)) + 5;
    const x1 = d3.scale.linear()
        .domain([0, 100])
        .range([0, width]);
    const x2 = d3.scale.linear()
        .domain([this.props.inputMin, this.props.inputMax])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain([0, yDomainMax])
        .range([height, 0]);
    const xAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .ticks(10)
        .outerTickSize(0);
    const xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient('top')
        .tickValues([this.props.userAnswer, this.props.actualAnswer, this.props.countryAnswer])
        .tickFormat('')
        .tickSize(height * -1, 0);
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('right')
        .tickValues([Math.ceil(yDomainMax / 2), yDomainMax])
        .tickFormat(d => `${d}%`)
        .tickSize(width, 0);
    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', 0)
        .attr('class', 'column-chart');
    const actualCircle = svg.append('g')
        .attr('class', 'actual-answer')
        .attr('transform', `translate(${x2(this.props.actualAnswer) + 14}, 14)`)
      .append('circle')
        .attr('r', 9)
        .style('opacity', 1e-6);
    const countryCircle = svg.append('g')
        .attr('class', 'country-answer')
        .attr('transform', `translate(${x2(this.props.countryAnswer) + 14}, 14)`)
      .append('circle')
        .attr('r', 9)
        .style('opacity', 1e-6);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(14, 28)')
        .call(yAxis)
      .selectAll('text')
        .attr('y', 9.75)
        .style('text-anchor', 'end');

    svg.select('.y')
      .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -4)
        .style('text-anchor', 'end')
        .text('Per cent of FT users');

    const bar = svg.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', (d, i) =>
          `translate(${(i * (width / 100)) + ((width / 100) / 5.05) + 12}, 28)`
        );
    const rect = bar.append('rect')
        .attr('x', 1)
        .attr('y', height)
        .attr('width', (width / 100) - ((width / 100) / 5.05))
        .attr('height', 0)
        .attr('stroke-width', () => {
          const rectWidth = d3.select(chart)
              .select('rect')
              .attr('width');

          return rectWidth * 0.1;
        });

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(14, ${height + 28})`)
        .call(xAxis);

    svg.append('g')
        .attr('class', 'x2 axis')
        .attr('transform', 'translate(14, 28)')
        .call(xAxis2)
      .selectAll('.tick')
        .attr('class', d => {
          if (d === this.props.userAnswer) {
            return 'tick user';
          } else if (d === this.props.actualAnswer) {
            return 'tick actual';
          } else if (d === this.props.countryAnswer) {
            return 'tick country';
          }
          return null;
        });

    // Set up on-render transitions
    svg.transition()
        .duration(500)
        .attr('height', height + margin.top + margin.bottom);

    actualCircle.transition()
        .duration(500)
        .style('opacity', 1);

    countryCircle.transition()
        .duration(500)
        .style('opacity', 1);

    rect.transition()
        .ease('elastic')
        .delay((d, i) => 500 + (i * 7.5))
        .duration(500)
        .attr('y', d => y(d || 0))
        .attr('height', d => height - y(d || 0));

    console.log(d3.max(data), yDomainMax);
    // Kick off transitions
    this.animateFauxDOM(2000);

    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 750));
  }

  redrawChart() {
    // Access the SVG virtual DOM
    const chart = this.connectedFauxDOM.chart;
    // Access the data
    const total = Object.keys(this.props.data)
      .reduce((sum, key) => sum + Number(this.props.data[key]), 0);
    const data = Object.keys(this.props.data).reduce((last, curr) => {
      last[curr] = (this.props.data[curr] / total) * 100; // eslint-disable-line
      return last;
    }, []) || Array(100);
    // Redraw the chart
    const margin = {
      top: 20,
      right: 28,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 14;
    const yDomainMax = (5 * Math.ceil(d3.max(data) / 5)) + 5;
    const x1 = d3.scale.linear()
        .domain([0, 100])
        .range([0, width]);
    const x2 = d3.scale.linear()
        .domain([this.props.inputMin, this.props.inputMax])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain([0, yDomainMax]) // TODO: set domain upper bound per chart requirements
        .range([height, 0]);
    const xAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90])
        .outerTickSize(0);
    const xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient('top')
        .tickValues([this.props.userAnswer, this.props.actualAnswer, this.props.countryAnswer])
        .tickFormat('')
        .tickSize(height * -1, 0);
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('right')
        .tickValues([Math.ceil(yDomainMax / 2), yDomainMax])
        .tickFormat(d => `${d}%`)
        .tickSize(width, 0);

    // Update chart width and drill down to update x axis
    d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .select('.x')
        .attr('transform', `translate(14, ${height + 28})`)
        .call(xAxis);

    d3.select(chart).select('.x2')
        .attr('transform', 'translate(14, 28)')
        .call(xAxis2);

    // Come back up to update y axis
    d3.select(chart).select('.y')
        .attr('transform', 'translate(14, 28)')
        .call(yAxis)
      .selectAll('text')
        .attr('y', 9.75)
        .style('text-anchor', 'end');

    d3.select(chart).select('.label')
        .attr('x', width)
        .attr('y', -4)
        .style('text-anchor', 'end')
        .text('Per cent of FT users');

    // Come back up again to update bars
    d3.select(chart).selectAll('.bar')
        .attr('transform', (d, i) =>
          `translate(${(i * (width / 100)) + ((width / 100) / 5.05) + 12}, 28)`
        )
      .select('rect')
        .attr('y', d => y(d))
        .attr('width', (width / 100) - ((width / 100) / 5.05))
        .attr('height', d => height - y(d))
        .attr('stroke-width', () => {
          const rectWidth = d3.select(chart)
              .select('rect')
              .attr('width');

          return rectWidth * 0.1;
        });

    d3.select(chart).select('.actual-answer')
        .attr('transform', `translate(${x2(this.props.actualAnswer) + 14}, 14)`);

    d3.select(chart).select('.country-answer')
        .attr('transform', `translate(${x2(this.props.countryAnswer) + 14}, 14)`);

    this.drawFauxDOM();
  }

  handleResize() {
    // Repeat height calculation with fallback value as above
    const calculatedHeight = (this.node.offsetWidth / 3.2) + 14;
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.setState({
      width: this.node.offsetWidth,
      height,
    });

    this.redrawChart();
  }

  render() {
    return (
      <div
        ref={node => { this.node = node; }}
        className="output-chart-container"
      >
        {this.state.chart}
      </div>
    );
  }
}

ColumnChart.propTypes = {
  data: React.PropTypes.object,
  initialWidth: React.PropTypes.number,
  inputMin: React.PropTypes.number,
  inputMax: React.PropTypes.number,
  units: React.PropTypes.string,
  userAnswer: React.PropTypes.number,
  actualAnswer: React.PropTypes.number,
  countryAnswer: React.PropTypes.number,
};

export default ColumnChart;
