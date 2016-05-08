# test terminal applications
This boilerplate shows how you can test console programs with [ava](https://github.com/sindresorhus/ava).

Testing is done by forking a child process, then listening to the child's
`stdout` and sending characters to the child's `stdin`. 

You may test for:

- Initial output
- Response in output to particular input
- If child process is alive
- Changes in file system
- Etc..

## What does the tests look like?
This is one of the tests for [index.js](index.js), a terminal app that writes
`.` to `stdout` upon input.

```js
test('any keypress gives . in terminal', async (t) => {
	const { stdout, child } = t.context
	// get initial output
	let output = await waitFor(stdout)

	// send a character
	child.stdin.write('a')
	output = await waitFor(stdout)
	// expect the output to be '.'
	t.true(output === '.')

	child.stdin.write('1')
	output = await waitFor(stdout)
	t.true(output === '.')
})
```
For more details, see [index.test.js](index.test.js).

## Usage
```sh
git clone https://github.com/arve0/test_terminal_apps
cd test_terminal_apps
npm install
```

Start the tests:
```sh
npm test
```

## Additional files

`.eslintrc`:

I have these plugins installed globally.

```sh
npm i eslint eslint-config-standard eslint-plugin-promise eslint-plugin-standard
```

`jsconfig.conf`:

Used by [Visual Studio Code](http://code.visualstudio.com/) for Intellisense auto completion.
