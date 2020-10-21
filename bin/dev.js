const shell = require('shelljs');
const config = require('../config/configs/index');

(async () => {
  shell.exec(`umi dev ${encodeURIComponent(JSON.stringify(config))}`, { async: true }, () => {});
})();
