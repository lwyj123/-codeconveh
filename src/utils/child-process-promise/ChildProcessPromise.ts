let Promise;

if (require('node-version').major >= 4) {
  Promise = global.Promise;
} else {
  // Don't use the native Promise in Node.js <4 since it doesn't support subclassing
  Promise = require('promise-polyfill');
}

class ChildProcessPromise extends Promise {
  constructor(executor: any) {
    let resolve;
    let reject;

    super((_resolve: any, _reject: any) => {
      resolve = _resolve;
      reject = _reject;

      if (executor) {
        executor(resolve, reject);
      }
    });

    this._cpResolve = resolve;
    this._cpReject = reject;
    this.childProcess = undefined;
  }

  progress(callback: any) {
    process.nextTick(() => {
      callback(this.childProcess);
    });

    return this;
  }

  then(onFulfilled: any, onRejected: any) {
    const newPromise = super.then(onFulfilled, onRejected);
    newPromise.childProcess = this.childProcess;
    return newPromise;
  }

  catch(onRejected: any) {
    const newPromise = super.catch(onRejected);
    newPromise.childProcess = this.childProcess;
    return newPromise;
  }

  done() {
    this.catch((e: any) => {
      process.nextTick(() => {
        throw e;
      });
    });
  }
}

ChildProcessPromise.prototype.fail = ChildProcessPromise.prototype.catch;

export default ChildProcessPromise;
