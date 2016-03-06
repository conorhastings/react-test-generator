import React, { Component, PropTypes } from 'react';

export default class Recurse extends Component {
  render() {
    return <div>{this.props.recurse}</div>;
  }
}

Recurse.propTypes = {
  recurse: PropTypes.string
};
