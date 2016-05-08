/**
 * Dummy app that prints a . for every keypress. Exits on Ctrl+C.
 */
const readline = require('readline')

// only TTYs have raw mode (not TTY if forked)
if (process.stdin.isTTY) {
	process.stdin.setRawMode(true)
}
readline.emitKeypressEvents(process.stdin)

// listen for keypresses
process.stdin.on('keypress', (str, key) => {
	if (key.ctrl && key.name === 'c') {
		process.stdout.write('\n')
		process.exit()
	}
	process.stdout.write('.')
})

// print welcome message
console.log('Press any key to fill your terminal with... Ctrl+C will exit.')
