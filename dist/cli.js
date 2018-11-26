"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const clime_1 = require("clime");
const cli = new clime_1.CLI('greet', Path.join(__dirname, 'commands'));
const shim = new clime_1.Shim(cli);
// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
//# sourceMappingURL=cli.js.map