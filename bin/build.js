const shell = require('shelljs');
const config = require('../config/configs/index');

(async () => {
  shell.exec(`umi build ${encodeURIComponent(JSON.stringify(config))}`, { async: true }, () => {});
})();
