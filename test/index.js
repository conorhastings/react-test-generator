import React, { Component, PropTypes } from 'react';

export default class Example extends Component {
  render() {
    return <div>{this.props.name} {this.props.coolGuy()}</div>;
  }
}

Example.propTypes = {
  name: PropTypes.string,
  coolGuy: PropTypes.func
};

