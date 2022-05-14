
const fs = require('fs');

const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.mkdir('/tmp/a/apple', { recursive: true }, (err) => {
	if (err) throw err;
});