
require('babel-register')({
  presets: [ 'es2015', 'react', 'stage-2' ]
});
const test = require('tape');
const React = require('react');
const Component = require('../test/index.js');

test('not required proptype name is actually not required', assert => {
  assert.doesNotThrow(() => React.createElement(Component, {"coolGuy":"cool"}))
  assert.end();
});
test('not required proptype coolGuy is actually not required', assert => {
  assert.doesNotThrow(() => React.createElement(Component, {"name":"cool"}))
  assert.end();
});
