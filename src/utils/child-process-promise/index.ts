const child_process = require('child_process');
// const crossSpawn = require('cross-spawn');
const ChildProcessPromise = require('./ChildProcessPromise');
const ChildProcessError = require('./ChildProcessError');

/* tslint:disable */

const slice = Array.prototype.slice;

/**
 * Promise wrapper for exec, execFile
 *
 * @param {String} method
 * @param {...*} args
 * @return {Promise}
 */
function doExec(method: any, args: any) {
  let cp: any;
  const cpPromise = new ChildProcessPromise();
  const reject = cpPromise._cpReject;
  const resolve = cpPromise._cpResolve;

  const finalArgs = slice.call(args, 0);
  finalArgs.push(callback);

  cp = child_process[method].apply(child_process, finalArgs);

  function callback(err: any, stdout: any, stderr: any) {
    if (err) {
      const commandStr = args[0] + (Array.isArray(args[1]) ? (' ' + args[1].join(' ')) : '');
      err.message += ' `' + commandStr + '` (exited with error code ' + err.code + ')';
      err.stdout = stdout;
      err.stderr = stderr;
      const cpError = new ChildProcessError(err.message, err.code, child_process, stdout, stderr);
      reject(cpError);
    } else {
      resolve({
        stdout,
        stderr,
        childProcess: cp,
      });
    }
  }

  cpPromise.childProcess = cp;

  return cpPromise;
}

/**
 * `exec` as Promised
 *
 * @param {String} command
 * @param {Object} options
 * @return {Promise}
 */
function exec(...rest: any[]) {
  return doExec('exec', rest);
}

export {
  exec,
};
