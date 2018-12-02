class ChildProcessError extends Error {
  code: any;
  childProcess: any;
  stdout: any;
  stderr: any;
  constructor(message: any, code: any, childProcess: any, stdout: any, stderr: any) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.childProcess = childProcess;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}

export default ChildProcessError;
