const { join } = require("path");

const commitLintConfig = join(__dirname, "commitlint.config.js");

module.exports = {
  hooks: {
    "commit-msg": `commitlint -e $GIT_PARAMS --config ${commitLintConfig}`
  }
};
