const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');

//чтение template.html в переменную templateText
let templateText = '';
const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
readableStream.on('data', chunk => {
	templateText += chunk;
	//создание папки project-dist
	fs.access(projectDist, fs.constants.F_OK, (err) => {
		if (err) {
			fs.mkdir(projectDist, (err) => {
				if (err) throw err;
			});
		}

		//получение текста из components вставка его в templateText и последующая запись его в project-dist/index.html 
		const components = path.join(__dirname, 'components');
		fs.readdir(components, (err, files) => {
			files.forEach(file => {
				fs.stat(path.join(components, file), (err, stats) => {
					if (!stats.isDirectory() && path.extname(file) === '.html') {
						const readableStream = fs.createReadStream(path.join(components, file), 'utf-8');
						readableStream.on('data', chunk => {
							templateText = templateText.replace(`{{${path.win32.basename(file, '.html')}}}`, chunk);
							const bundle = fs.createWriteStream(path.join(projectDist, 'index.html'));
							bundle.write(templateText);
						});
					}
				});
			});
		});
		// конец заполнения project-dist/index.html 

		//копирование каталога assets в project-dist
		const assets = path.join(__dirname, 'assets');
		const copyAssets = path.join(projectDist, 'assets');

		//рекурсивное копирование каталога
		function copyDir(dirSourse, dirCopy) {
			fs.readdir(dirSourse, (err, files) => {
				files.forEach(file => {
					fs.stat(path.join(dirSourse, file), (err, stats) => {
						if (!stats.isDirectory()) {
							fs.copyFile(path.join(dirSourse, file), path.join(dirCopy, file), (err) => {
								if (err) throw err;
							});
						} else {
							const dirCopyExt = path.join(dirCopy, file);
							const dirSourseExt = path.join(dirSourse, file);
							fs.mkdir(dirCopyExt, (err) => {
								if (err) throw err;
							});
							copyDir(dirSourseExt, dirCopyExt);
						}
					});
				});
			});
		};
		//удаляем каталог assets в project-dist, после чего создаем и копируем туда все из assets 
		fs.rm(copyAssets, { recursive: true, force: true }, (err) => {
			if (err) throw err;
			fs.mkdir(copyAssets, (err) => {
				if (err) throw err;
			});
			copyDir(assets, copyAssets);
		});
		//конец копирование каталога

		//сборка стилей style.css
		const styleStream = fs.createWriteStream(path.join(projectDist, 'style.css'));
		const styles = path.join(__dirname, 'styles');
		fs.readdir(styles, (err, files) => {
			files.forEach(file => {
				fs.stat(path.join(styles, file), (err, stats) => {
					if (!stats.isDirectory() && path.extname(file) === '.css') {
						const readableStreamStyles = fs.createReadStream(path.join(styles, file), 'utf-8');
						readableStreamStyles.pipe(styleStream);
					}
				});
			});
		});
		//конец сборка стилей style.css
	});
});