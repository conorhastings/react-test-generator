require('babel-register')({
  presets: [ 'es2015', 'react', 'stage-2' ]
});
const test = require('tape');
const React = require('react');
const ReactDOM = require('react-dom/server');
const Component = require('../test/index.js').default;


test('not required proptype name is actually not required', assert => {
  const props = {"coolGuy":"() => {}"};
  Object.keys(props).forEach(prop => {
    if (props[prop] === '() => {}') {
      props[prop] = () => {};
    }
  });
  assert.doesNotThrow(() => ReactDOM.renderToString(React.createElement(Component, props)));
  assert.end();
});

test('not required proptype coolGuy is actually not required', assert => {
  const props = {"name":"cool"};
  Object.keys(props).forEach(prop => {
    if (props[prop] === '() => {}') {
      props[prop] = () => {};
    }
  });
  assert.doesNotThrow(() => ReactDOM.renderToString(React.createElement(Component, props)));
  assert.end();
});
