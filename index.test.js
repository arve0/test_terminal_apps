const test = require('ava')
const fork = require('child_process').fork
// may use `child_process.spawn` if the application is not a node program

/**
 * Will run before every test.
 * You may also use `test.before` alongside `test.serial` to test the console
 * application in a serial manner, keeping it alive for the whole test session.
 */
test.beforeEach((t) => {
	const CMD = 'index.js'
	// forks index.js as a node process
	// silent: true -> do not pipe child.stdout to process.stdout
	const child = fork(CMD, [], { silent: true })

	// keep output history in an array
	const stdout = []
	child.stdout.setEncoding('utf8')
	child.stdout.on('data', (d) => {
		stdout.push(d)
	})

	// throw on child stderr
	child.stderr.on('data', (d) => {
		throw new Error(d)
	})

	// access child and stdout array from tests
	t.context = { child, stdout }
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
	const { stdout } = t.context
	let output = await waitFor(stdout)
	// console.log(output)
	t.true(output.indexOf('Press any key') !== -1)
})

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

test('Ctrl+C exits program', async (t) => {
	const { stdout, child } = t.context
	let output = await waitFor(stdout)

	child.stdin.write('\x03')  // Ctrl+C
	output = await waitFor(stdout)
	t.true(output === '\n')
	t.false(child.connected)
})

/**
 * Helper functions.
 */

/**
 * waitFor(what, timeout = 1000)
 * 
 * @argument what {array}: Array to listen for changes in.
 * @argument [timeout] {int}: Optional timeout. Will reject promise.
 * @returns Promise: Resolves when an item is added to `what`.
 *                   Resolved with last item in `what`.
 *                   Rejects if no item has been added after `timeout` ms.
 */
function waitFor (what, timeout = 1000) {
	let initial = what.length
	return new Promise((resolve, reject) => {
		let t = setTimeout(reject, timeout)
		let i = setInterval(() => {
			if (initial !== what.length) {
				clearInterval(i)
				clearTimeout(t)
				resolve(last(what))
			}
		}, 10)  // check every 10 ms
	})
}

/**
 * last(arr) returns last item in array `arr`.
 */
function last (arr) {
	return arr.slice(arr.length - 1)[0]
}
