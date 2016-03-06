import React, { Component, PropTypes } from 'react';

export default class Second extends Component {
  render() {
    return <div>{this.props.something} {this.props.somethingElse}</div>;
  }
}

Second.propTypes = {
  something: PropTypes.string,
  somethingElse: PropTypes.number
};

