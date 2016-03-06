#!/usr/bin/env node
const program = require('commander');
const docGen = require('react-docgen');
const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');

program
.version('0.0.0')
.option('-i, --in <dir>', 'in directory')
.option('-o, --out <dir>', 'out directory')
.parse(process.argv);

readDirAndCreateTests(path.join(process.cwd(), program.in), path.join(process.cwd(), program.out));

function readDirAndCreateTests(inDir, outDir) {
  fs.readdir(inDir, (err, files) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    }
    files.forEach(file => {
      fs.stat(path.join(inDir, file), (err, stat) => {
        if (err) {
          console.log(err.stack);
          process.exit(1);
        }
        if (stat.isFile()) {
          fs.readFile(path.join(inDir, file), 'utf-8', (err, data) => {
            if (err) {
              console.log(err.stack);
              process.exit(1);
            }
            try {
              const parse = docGen.parse(data);
              const test = createTest(parse, path.join(inDir, file));
              mkdir(outDir, err => {
                if (err) {
                  console.log(err.stack);
                  process.exit(1);
                }
                fs.writeFile(path.join(outDir, file), test);
              });
            }
            catch (e) {
              // do nothing
            }
          });
        }
        else {
         readDirAndCreateTests(path.join(inDir, file), path.join(outDir, file));
        }
      });
    });
  });
}

function createTest(component, pathToComponent) {
  const basicPropTypes = {
    string: "cool",
    number: 2,
    bool: true,
    object: {},
    array: [],
    func: '() => {}'
  };

  const componentProps = component.props;
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
const Component = require('${pathToComponent}').default;

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
  return test;
}