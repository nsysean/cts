const { run } = require ('./functions/basic.js'), options = require('./options.json');
console.log(options);
options.input = options.input.substring(1, options.input.length-1).replaceAll('\\n', '\r\n');
console.log(options);
run(options.timelimit, options.lang, options.ver, options.code, options.input, { bool: false }, '', function (data) {
    console.log(data);
});
