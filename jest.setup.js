import '@testing-library/jest-dom';
// Polyfill TextEncoder/Decoder for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('util');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}
