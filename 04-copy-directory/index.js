
const fs = require('fs');
const path = require('path');

const sourceFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');


fs.access(copyFolder, fs.constants.F_OK, (err) => {
	if (err) {
		fs.mkdir(copyFolder, (err) => {
			if (err) throw err;
		});
	}
});

fs.readdir(sourceFolder, (err, files) => {
	files.forEach(file => {
		fs.stat(path.join(sourceFolder, file), (err, stats) => {
			if (!stats.isDirectory()) {
				fs.copyFile(path.join(sourceFolder, file), path.join(copyFolder, file), (err) => {
					if (err) throw err;
				});
			}
		});
	});
});


