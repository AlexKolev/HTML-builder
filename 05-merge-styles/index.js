const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const bundle = fs.createWriteStream(path.join(projectDist, 'bundle.css'));
const styles = path.join(__dirname, 'styles');

fs.readdir(styles, (err, files) => {
	files.forEach(file => {
		const fileName = file.split('.');
		fs.stat(path.join(styles, file), (err, stats) => {
			if (!stats.isDirectory() && fileName[1] === 'css') {
				const readableStream = fs.createReadStream(path.join(styles, file), 'utf-8');
				readableStream.pipe(bundle);
			}
		});
	});
});