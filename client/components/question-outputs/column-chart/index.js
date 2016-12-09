import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import throttle from 'lodash/throttle';
import d3 from 'd3';

class ColumnChart extends Component {
  constructor(props) {
    super(props);

    // Calculate height at 16:9 aspect ratio
    const calculatedHeight = (this.props.parentWidth / 1.78) + 11.5;
    // Make sure height is never less than n
    const height = calculatedHeight < 125 ? 125 : calculatedHeight;

    this.state = {
      width: this.props.parentWidth,
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
    const data = this.props.data;
    // Run some D3 on the faux SVG
    const margin = { // Mike Bostock's margin convention
      top: 20,
      right: 23,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 11.5;
    const x1 = d3.scale.linear()
        .domain([0, data.length])
        .range([0, width]);
    const x2 = d3.scale.linear()
        .domain([this.props.inputMin, this.props.inputMax])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);
    const xAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90])
        .outerTickSize(0);
    const xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient('top')
        .tickValues([this.props.userAnswer, this.props.actualAnswer])
        .tickFormat('')
        .tickSize(height * -1, 0);
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('right')
        .tickValues([50, 100])
        .tickFormat(d => `${d}%`)
        .tickSize(width, 0);
    const svg = d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', 0)
        .attr('class', 'column-chart');

    svg.append('g')
        .attr('class', 'actual-answer')
        .attr('transform', `translate(${x2(this.props.actualAnswer) + 11.5}, 11.5)`)
      .append('circle')
        .attr('r', 11.5);

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(11.5, 23)')
        .call(yAxis)
      .selectAll('text')
        .attr('y', 9)
        .style('text-anchor', 'end');

    const bar = svg.selectAll('.bar')
        .data(data)
      .enter().append('g')
        .attr('class', 'bar')
        .attr('transform', (d, i) =>
          `translate(${(i * (width / data.length)) + ((width / data.length) / 5.05) + 9.5}, 23)`
        );
    const rect = bar.append('rect')
        .attr('x', 1)
        .attr('y', height)
        .attr('width', (width / data.length) - ((width / data.length) / 5.05))
        .attr('height', 0)
        .attr('fill', d => {
          const color = d === d3.max(data) ? '#9e2f50' : null;

          return color;
        })
        .attr('stroke-width', () => {
          const rectWidth = d3.select(chart)
              .select('rect')
              .attr('width');

          return rectWidth * 0.1;
        });

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(11.5, ${height + 23})`)
        .call(xAxis);


    svg.append('g')
        .attr('class', 'x2 axis')
        .attr('transform', 'translate(11.5, 23)')
        .call(xAxis2)
      .selectAll('.tick')
        .attr('class', d => {
          if (d === this.props.userAnswer) {
            return 'tick user';
          } else if (d === this.props.actualAnswer) {
            return 'tick actual';
          }
          return null;
        });

    // Set up on-render transitions
    svg.transition()
        .duration(500)
        .attr('height', height + margin.top + margin.bottom);

    rect.transition()
        .ease('elastic')
        .delay((d, i) => 500 + (i * 7.5))
        .duration(500)
        .attr('y', d =>
          height - ((d / 100) * height)
        )
        .attr('height', d =>
          (d / 100) * height
        );

    // Kick off transitions
    this.animateFauxDOM(2000);

    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 500));
  }

  redrawChart() {
    // Access the SVG virtual DOM
    const chart = this.connectedFauxDOM.chart;
    // Access the data
    const data = this.props.data;
    // Redraw the chart
    const margin = {
      top: 20,
      right: 23,
      bottom: 30,
      left: 0,
    };
    const width = this.state.width - margin.left - margin.right;
    const height = ((this.state.height - margin.top) - margin.bottom) + 11.5;
    const x1 = d3.scale.linear()
        .domain([0, data.length])
        .range([0, width]);
    const x2 = d3.scale.linear()
        .domain([this.props.inputMin, this.props.inputMax])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain([0, 100]) // TODO: set domain upper bound per chart requirements
        .range([height, 0]);
    const xAxis = d3.svg.axis()
        .scale(x1)
        .orient('bottom')
        .tickValues([10, 20, 30, 40, 50, 60, 70, 80, 90])
        .outerTickSize(0);
    const xAxis2 = d3.svg.axis()
        .scale(x2)
        .orient('top')
        .tickValues([this.props.userAnswer, this.props.actualAnswer])
        .tickFormat('')
        .tickSize(height * -1, 0);
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('right')
        .tickValues([50, 100])
        .tickFormat(d => `${d}%`)
        .tickSize(width, 0);

    // Update chart width and drill down to update x axis
    d3.select(chart)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .select('.x')
        .attr('transform', `translate(11.5, ${height + 23})`)
        .call(xAxis);

    d3.select(chart).select('.x2')
        .attr('transform', 'translate(11.5, 23)')
        .call(xAxis2);

    // Come back up to update y axis
    d3.select(chart).select('.y')
        .attr('transform', 'translate(11.5, 23)')
        .call(yAxis)
      .selectAll('text')
        .attr('y', 9)
        .style('text-anchor', 'end');

    // Come back up again to update bars
    d3.select(chart).selectAll('.bar')
        .attr('transform', (d, i) =>
          `translate(${(i * (width / data.length)) + ((width / data.length) / 5.05) + 9.5}, 23)`
        )
      .select('rect')
        .attr('y', d =>
          height - ((d / 100) * height)
        )
        .attr('width', (width / data.length) - ((width / data.length) / 5.05))
        .attr('height', d =>
          (d / 100) * height
        )
        .attr('stroke-width', () => {
          const rectWidth = d3.select(chart)
              .select('rect')
              .attr('width');

          return rectWidth * 0.1;
        });

    d3.select(chart).select('.actual-answer')
        .attr('transform', `translate(${x2(this.props.actualAnswer) + 11.5}, 11.5)`);

    this.drawFauxDOM();
  }

  handleResize() {
    // Repeat height calculation with fallback value as above
    const calculatedHeight = (this.node.offsetWidth / 1.78) + 11.5;
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
  data: React.PropTypes.array,
  parentWidth: React.PropTypes.number,
  inputMin: React.PropTypes.number,
  inputMax: React.PropTypes.number,
  userAnswer: React.PropTypes.number,
  actualAnswer: React.PropTypes.number,
};

export default ColumnChart;
