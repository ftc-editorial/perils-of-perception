import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import throttle from 'lodash/throttle';
import d3 from 'd3';

class AreaChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: this.props.parentWidth,
      chart: 'Loading distribution chart…',
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
    const width = this.state.width;
    const height = 50;
    const x = d3.scale.linear()
        .domain([0, data.length])
        .range([0, width]);
    const y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);
    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');
    const yAxis = d3.svg.axis()
        .scale(y)
        .orient('left');
    const area = d3.svg.area()
        .x((d, i) => i * (width / (data.length - 1)))
        .y0(height)
        .y1(height)
        .interpolate('basis');
    const svg = d3.select(chart)
        .attr('width', width)
        .attr('height', 0)
        .attr('class', 'area-chart');
    const path = svg.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('d', area);

    svg.append('g').attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    svg.append('g').attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 11)
        .style('text-anchor', 'end')
        .text('% users');

    // Set up transitions
    svg.transition()
        .duration(500)
        .attr('height', height);

    area.y1(d => (height - ((d / 100) * height)));

    path.transition()
        .delay(500)
        .duration(500)
        .attr('d', area);

    // Kick off transitions
    this.animateFauxDOM(1000);

    // Add window resize event listener
    window.addEventListener('resize', throttle(this.handleResize, 500));
  }

  handleResize() {
    this.setState({ width: this.node.offsetWidth });
    this.redrawChart();
  }

  redrawChart() {
    // Access the SVG virtual DOM
    const chart = this.connectedFauxDOM.chart;
    const width = this.state.width;
    const height = 50;
    const x = d3.scale.linear()
        .domain([0, 100])
        .range([0, width]);
    const xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');
    const area = d3.svg.area()
        .x((d, i) => i * (width / (this.props.data.length - 1)))
        .y0(height)
        .y1(d => (height - ((d / 100) * height)))
        .interpolate('basis');

    // Update chart width and drill down to update x axis
    d3.select(chart)
        .attr('width', width)
      .select('.x')
        .call(xAxis);

    // Come back up to update area
    d3.select(chart).select('.area')
        .attr('d', area);

    this.drawFauxDOM();
  }

  render() {
    return (
      <div
        ref={node => { this.node = node; }}
        className="chart-container"
      >
        {this.state.chart}
      </div>
    );
  }
}

AreaChart.propTypes = {
  data: React.PropTypes.array,
  parentWidth: React.PropTypes.number,
};

export default AreaChart;
//
