# React Test Generator

This is project is very much experimental, and very much a work in progress. The end goal is to provide meaningful baseline tests for your React Components. Whether or does that or not right now is definitely debatable. But in the spirit of publish early...

## What does it do Right now? 

Right now it will crawl a given directory looking for react components (see <a href="https://github.com/reactjs/react-docgen#guidelines-for-default-resolvers-and-handlers"> here</a> to learn how we currently figure out what is a component.). Once it finds a component it will right a basic test asserting said it is in fact a react element, as well as tests asserting that props that propTypes implies are not required do not cause the component to throw when rendered. 

It is command line only right now, though i hope to provide a node accessible api shortly.

## Use
Installing globally is the most useful for now

`npm install react-test-generator -g` 

Once installed call this command in your terminal

`react-testgen -i '/path/to/my/components -o '/tests'` 

and can call `react-testgen -h` for help. 

This will generate test files for each located component following the same directory structure as the input path. This is a useful command for executing all the tests at once:

`find ./gen-test -name '*.js' -exec tape {} \;'`

## Commands
* `-i, --in` - in directory
* `-o, --out` out directory
* `--no-overwrite` - do not overwrite current test files

See <a href="https://github.com/conorhastings/react-test-generator/blob/master/package.json#L7">here</a> for usage example in a `package.json`. 

Please file issues offering suggestions or documenting bugs, as this is, as mentioned above a huge WIP. 

Here is an example of some generated tests being run, you can find the components that generated these tests <a href="https://github.com/conorhastings/react-test-generator/tree/master/components">here</a> and tests they generated <a href="https://github.com/conorhastings/react-test-generator/tree/master/test">here</a>.

<img src="http://i.imgur.com/oo8VgVR.png" />
