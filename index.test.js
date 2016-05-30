const test = require('ava')
const ttyTestHelper = require('tty-test-helper')

/**
 * Will run before every test.
 * You may also use `test.before` alongside `test.serial` to test the console
 * application in a serial manner, keeping it alive for the whole session.
 */
test.beforeEach((t) => {
	const CMD = 'index.js'
	t.context = ttyTestHelper(__dirname + '/' + CMD)
})

test.afterEach((t) => {
	// terminate child
	if (t.context.child.connected) {
		t.context.child.disconnect()
	}
})

/**
 * These tests will run concurrently.
 * You can run them serial by using `test.serial((t) => { ... })`.
 */
test('gets a welcome message', async (t) => {
	const { waitFor } = t.context
	return waitFor('Press any key')
})

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

test('Ctrl+C exits program', async (t) => {
	const { next, stdin, child } = t.context
	await next()

	let output = next()
	stdin.write('\x03')  // Ctrl+C
	output = await output
	t.true(output === '\n')
	t.false(child.connected)
})
