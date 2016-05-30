# test terminal applications
This boilerplate shows how you can test console programs with [ava](https://github.com/sindresorhus/ava).

Testing is done by forking a child process, then listening to the child's
`stdout` and sending characters to the child's `stdin` with help from [tty-test-helper](https://github.com/arve0/tty-test-helper).

You may test for:

- Initial output
- Response in output to particular input
- If child process is alive
- Etc..

## What does the tests look like?
Test a terminal app that writes `.` to `stdout` upon input:

```js
test('any keypress gives . in terminal', async (t) => {
	const { next, stdin } = t.context
	// get initial output
	// default timeout is 1000 ms, which will throw and fail the test
	let output = await next()

  // start listening for next output
	output = next()
	// send a character
	stdin.write('a')
	// wait until we get the output
	output = await output
	// expect the output to be '.'
	t.true(output === '.')

	// do once more with another character
	output = next()
	stdin.write('1')
	output = await output
	t.true(output === '.')
})
```
For more details, see [index.js](index.js) and [index.test.js](index.test.js).

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
npm i -g eslint eslint-config-standard eslint-plugin-promise eslint-plugin-standard
```

`jsconfig.conf`:

Used by [Visual Studio Code](http://code.visualstudio.com/) for Intellisense auto completion.
