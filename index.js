const { run } = require ('./functions/basic.js'), fs = require('fs');
fs.readFile('main.cpp', function (err, code) {
    if (err) throw err;
    run(1000, 'pp', 17, code.toString(), '1\r\n1\r\n===\r\n2\r\n', { bool: false, output: '1\r\n===\r\n2\r\n', ans: '1\r\n===\r\n2\r\n' }, '', function (data) {
        console.log(data);
    });
});