/**
 * !! Please JSON.strnigfy input before using function
 * @param {*} timelimit allowed runtime before exiting ( in ms )
 * @param {*} lang Code language, (cpp, py, kt, pp) pp = pascal rofl
 * @param {*} version Code lang ver, default is 17 -> only avail for c++ sry
 * @param {*} code Code
 * @param {*} input Input for the Code, test cases should be seperated by '\r\n===\r\n'
 * @param {*} special bool: whether program is checker style or not
 * @param {*} cmdline cmd line args
 * @returns whether code compiliation was a success, err, stderr, stdout
 */
function run (timelimit, lang = 'cpp', version = 17, code = '', input = '1\r\n', special = { bool: false, output: '', ans: '' }, cmdline = '', _callback) {
    const { spawn, exec } = require('child_process'), fs = require('fs');
    let result = {
        success: true,
        error: '',
        cases: []
    };
    fs.writeFile(`./codes/main.${lang}`, code, function(err) {
        if (err) {
            console.log(err);
        } else {
            let tcs = [], tcso = [], tcsa = [];
            while (input.length) {
                let point = input.search('\r\n===\r\n');
                if (point == -1) {
                    tcs.push(input.replaceAll('\r\n', '\n'));
                    input = '';
                } else {
                    tcs.push(input.substring(0, point + 2).replaceAll('\r\n', '\n'));
                    input = input.substring(point + 7);
                }
            }
            if (special.bool) {
                let output = special.output, ans = special.ans;
                while (output.length) {
                    let point = output.search('\r\n===\r\n');
                    if (point == -1) {
                        tcso.push(output.replaceAll('\r\n', '\n'));
                        output = '';
                    } else {
                        tcso.push(output.substring(0, point + 2).replaceAll('\r\n', '\n'));
                        output = output.substring(point + 7);
                    }
                }
                while (ans.length) {
                    let point = ans.search('\r\n===\r\n');
                    if (point == -1) {
                        tcsa.push(ans.replaceAll('\r\n', '\n'));
                        ans = '';
                    } else {
                        tcsa.push(ans.substring(0, point + 2).replaceAll('\r\n', '\n'));
                        ans = ans.substring(point + 7);
                    }
                }
            }
            if (lang == 'cpp') {
                exec ('g++ ./codes/main.cpp', 'std=c++' + version, function (err) {
                    if (err) {  
                        result.success = false,
                        result.error = err.toString();
                        _callback(result);
                    } else {
                        let i;
                        for (i = 1; i <= tcs.length;) {
                            let cur = i;
                            const tc = tcs[i - 1];
                            result.cases.push({
                                stderr: '',
                                stdout: '',
                                comment: ''
                            });
                            if (special.bool) { 
                                fs.writeFile('input/out', tcso[i - 1], function () {});
                                fs.writeFile('input/ans', tcsa[i - 1], function () {});
                            }
                            fs.writeFile('input/in', tc, function () {
                                const child = spawn('./a.out', (special.bool ? ['./input/in', './input/out', './input/ans', cmdline] : {}));
                                child.stderr.on('data', function(data) {
                                    result.cases[cur - 1].stderr = data.toString();
                                });
                                child.stdout.on('data', function(data) {
                                    result.cases[cur - 1].stdout = data.toString();
                                });
                                child.on('close', function () {
                                    result.cases[cur - 1].comment = 'ok';
                                    clearTimeout(tle);
                                    i++;
                                });
                                const tle = setTimeout(function () {
                                    result.cases[cur - 1].comment = 'tle';
                                    child.kill();
                                }, timelimit);
                                setTimeout(function () {
                                    if (result.cases[cur - 1].comment != 'ok') {
                                        child.stdin.write(tc, function (err) {
                                            if (err) console.log(err);
                                        });    
                                    }
                                }, 10);
                            });
                            i++;
                        }
                        const interval = setInterval(function () {
                            if (result.cases.find(elm => elm.comment == '') == undefined) {
                                _callback(result);
                                clearInterval(interval);
                            }
                        }, 0);
                    }
                });
            } else if (lang == 'py') {
                let arr = ['./codes/main.py'];
                if (special.bool) {
                    arr.push('./input/in'), arr.push('./input/out'), arr.push('./input/ans');
                }
                arr.push(cmdline);
                for (i = 1; i <= tcs.length;) {
                    let cur = i;
                    const tc = tcs[i - 1];
                    result.cases.push({
                        stderr: '',
                        stdout: '',
                        comment: ''
                    });
                    if (special.bool) { 
                        fs.writeFile('input/out', tcso[i - 1], function () {});
                        fs.writeFile('input/ans', tcsa[i - 1], function () {});
                    }
                    fs.writeFile('input/in', tc, function () {
                        const child = spawn('python3', arr);
                        child.stdin.write(tc, function (err) {
                            if (err) console.log(err);
                        });    
                        child.stderr.on('data', function(data) {
                            result.cases[cur - 1].stderr = data.toString();
                        });
                        child.stdout.on('data', function(data) {
                            result.cases[cur - 1].stdout = data.toString();
                        });
                        child.on('close', function () {
                            result.cases[cur - 1].comment = 'ok';
                            clearTimeout(tle);
                            i++;
                        });
                        const tle = setTimeout(function () {
                            result.cases[cur - 1].comment = 'tle';
                            child.kill();
                        }, timelimit);
                    });
                    i++;
                }
                const interval = setInterval(function () {
                    if (result.cases.find(elm => elm.comment == '') == undefined) {
                        _callback(result);
                        clearInterval(interval);
                    }
                }, 0);
            } else if(lang == 'kt') {
                exec ('kotlinc ./codes/main.kt -include-runtime -d main.jar', function (err) {
                    if (err) {  
                        result.success = false,
                        result.error = err.toString();
                        _callback(result);
                    } else {
                        let i;
                        for (i = 1; i <= tcs.length;) {
                            let cur = i;
                            const tc = tcs[i - 1];
                            result.cases.push({
                                stderr: '',
                                stdout: '',
                                comment: ''
                            });
                            if (special.bool) { 
                                fs.writeFile('input/out', tcso[i - 1], function () {});
                                fs.writeFile('input/ans', tcsa[i - 1], function () {});
                            }
                            fs.writeFile('input/in', tc, function () {
                                let arr = ['-jar', 'main.jar'];
                                if (special.bool) {
                                    arr.push('./input/in'), arr.push('./input/out'), arr.push('./input/ans');
                                }
                                arr.push(cmdline);
                                const child = spawn('java', arr);
                                child.stdin.write(tc, function (err) {
                                    if (err) console.log(err);
                                });     
                                let stderr = [], stdout = [];
                                child.stderr.on('data', function(data) {
                                    stderr.push(data.toString());
                                });
                                child.stdout.on('data', function(data) {
                                    stdout.push(data.toString());
                                });
                                child.on('close', function () {
                                    result.cases[cur - 1].stderr = stderr.join(''),
                                    result.cases[cur - 1].stdout = stdout.join(''),
                                    result.cases[cur - 1].comment = 'ok';
                                    clearTimeout(tle);
                                    i++;
                                });
                                const tle = setTimeout(function () {
                                    result.cases[cur - 1].comment = 'tle';
                                    child.kill();
                                }, timelimit);
                            });
                            i++;
                        }
                        const interval = setInterval(function () {
                            if (result.cases.find(elm => elm.comment == '') == undefined) {
                                _callback(result);
                                clearInterval(interval);
                            }
                        }, 0); 
                    }
                });
            } else if(lang == 'pp') {
                exec ('fpc ./codes/main.pp', function (err) {
                    if (err) {  
                        result.success = false,
                        result.error = err.toString();
                        _callback(result);
                    } else {
                        let i;
                        for (i = 1; i <= tcs.length;) {
                            let cur = i;
                            const tc = tcs[i - 1];
                            result.cases.push({
                                stderr: '',
                                stdout: '',
                                comment: ''
                            });
                            if (special.bool) { 
                                fs.writeFile('input/out', tcso[i - 1], function () {});
                                fs.writeFile('input/ans', tcsa[i - 1], function () {});
                            }
                            fs.writeFile('input/in', tc, function () {
                                const child = spawn('./codes/main', (special.bool ? ['./input/in', './input/out', './input/ans', cmdline] : {}));
                                child.stderr.on('data', function(data) {
                                    result.cases[cur - 1].stderr = data.toString();
                                });
                                child.stdout.on('data', function(data) {
                                    result.cases[cur - 1].stdout = data.toString();
                                });
                                child.on('close', function () {
                                    result.cases[cur - 1].comment = 'ok';
                                    clearTimeout(tle);
                                    i++;
                                });
                                const tle = setTimeout(function () {
                                    result.cases[cur - 1].comment = 'tle';
                                    child.kill();
                                }, timelimit);
                                setTimeout(function () {
                                    if (result.cases[cur - 1].comment != 'ok') {
                                        child.stdin.write(tc, function (err) {
                                            if (err) console.log(err);
                                        });    
                                    }
                                }, 10);
                            });
                            i++;
                        }
                        const interval = setInterval(function () {
                            if (result.cases.find(elm => elm.comment == '') == undefined) {
                                _callback(result);
                                clearInterval(interval);
                            }
                        }, 0);
                    }
                });
            }
        }
    });
}

module.exports = { run };