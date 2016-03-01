const docGen = require('react-docgen');
const fs = require('fs');
const path = require('path')

const component = fs.readFileSync(path.join(__dirname, '..', 'test', 'index.js'));
const parse = docGen.parse(component);
const basicPropTypes = {
  string: "cool",
  number: 2,
  bool: true,
  object: {},
  array: [],
  func: `() => {}`
};
const notRequiredProps = Object.keys(parse.props).filter(prop => !prop.required);
const asserts = notRequiredProps.map(prop => {
  const otherProps = Object.keys(parse.props).reduce((props, oProp) => {
    if (oProp !== prop) {
      props[oProp] = basicPropTypes[parse.props[oProp].type.name];
    }
    return props;
  }, {});
return (`test('not required proptype ${prop} is actually not required', assert => {
  assert.doesNotThrow(() => React.createElement(Component, ${JSON.stringify(otherProps)}))
  assert.end();
});`);
});
const test = `
require('babel-register')({
  presets: [ 'es2015', 'react', 'stage-2' ]
});
const test = require('tape');
const React = require('react');
const Component = require('../test/index.js');

${asserts.join('\n')}
`

console.log(test);
fs.writeFile(path.join(__dirname, '..', 'gen-test', 'index.js'), test);