const docGen = require('react-docgen');
const fs = require('fs');
const path = require('path')

const component = fs.readFileSync(path.join(__dirname, 'test', 'index.js'));

const parse = docGen.parse(component);

const basicPropTypes = {
  string: "cool",
  number: 2,
  bool: true,
  object: {},
  array: [],
  func: '() => {}'
};

const componentProps = parse.props;
const allProps = Object.keys(componentProps);
const notRequiredProps = allProps.filter(prop => !prop.required);
const asserts = notRequiredProps.map(prop => {
  const otherProps = allProps.reduce((props, oProp) => {
    if (oProp !== prop) {
      if (componentProps[oProp].defaultValue && !componentProps[oProp].defaultValue.computed) {
        props[oProp] = componentProps[oProp].defaultValue.value;
      }
      else {
        props[oProp] = basicPropTypes[componentProps[oProp].type.name];
      }
    }
    return props;
  }, {});
return (`test('not required proptype ${prop} is actually not required', assert => {
  let props = ${JSON.stringify(otherProps)};
  props = convertFunctionProp(props);
  assert.doesNotThrow(() => ReactDOM.renderToString(React.createElement(Component, props)));
  assert.end();
});`);
});
const test = (
`'use strict';
require('babel-register')({
  presets: [ 'es2015', 'react', 'stage-2' ]
});
const test = require('tape');
const React = require('react');
const ReactDOM = require('react-dom/server');
const TestUtils = require('react-addons-test-utils');
const Component = require('../test/index.js').default;

function convertFunctionProp(props) {
 return Object.keys(props).reduce((newProps, prop, i) => {
    if (props[prop] === '() => {}') {
      newProps[prop] = () => {};
    }
    else {
      newProps[prop] = props[prop];
    }
    return newProps;
  }, {});
}

test('is a valid React Component', assert => {
  assert.ok(TestUtils.isElement(React.createElement(Component, {})), 'is valid');
  assert.end();
});

${asserts.join('\n\n')}
`);

console.log(test);
fs.writeFile(path.join(__dirname, 'gen-test', 'index.js'), test);