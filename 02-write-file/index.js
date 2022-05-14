const fs = require('fs');
const path = require('path');
const { stdout, stdin, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, '02writefile.txt'));

stdout.write('Введите, пожалуйста, текст (для выхода нажмите Ctrl+C или напишите exit)\n');
stdout.write('> ');
stdin.on('data', data => {
	const text = data.toString();
	if (text.substring(0, 4) === 'exit') {
		process.exit();
	}
	output.write(data);
});

process.on('exit', () => stdout.write('Ввод текста окончен, до свидания! '));
process.on('SIGINT', () => {
	process.exit();
});