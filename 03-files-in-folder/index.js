const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
	files.forEach(file => {
		const fileName = file.split('.');
		fs.stat(path.join(__dirname, 'secret-folder', file), (err, stats) => {
			if (!stats.isDirectory()) {
				console.log(`${fileName[0]} - ${fileName[1]} - ${stats.size} bytes или ${stats.size / 1024} kb`);
			}
		});
	});
});
