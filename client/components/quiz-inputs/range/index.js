import React from 'react';

const Range = ({ rangeMin, rangeMax }) => <input type="range" min={rangeMin} max={rangeMax} />;

Range.propTypes = {
  rangeMin: React.PropTypes.number,
  rangeMax: React.PropTypes.number,
};

export default Range;
