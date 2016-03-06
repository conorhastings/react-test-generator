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
      props[oProp] = basicPropTypes[componentProps[oProp].type.name];
    }
    return props;
  }, {});
return (`test('not required proptype ${prop} is actually not required', assert => {
  const props = ${JSON.stringify(otherProps)};
  Object.keys(props).forEach(prop => {
    if (props[prop] === '() => {}') {
      props[prop] = () => {};
    }
  });
  assert.doesNotThrow(() => ReactDOM.renderToString(React.createElement(Component, props)));
  assert.end();
});`);
});
const test = (
`require('babel-register')({
  presets: [ 'es2015', 'react', 'stage-2' ]
});
const test = require('tape');
const React = require('react');
const ReactDOM = require('react-dom/server');
const Component = require('../test/index.js').default;


${asserts.join('\n\n')}
`);

console.log(test);
fs.writeFile(path.join(__dirname, 'gen-test', 'index.js'), test);