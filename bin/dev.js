const shell = require('shelljs');
const config = require('../config/configs/index');

(async () => {
  shell.exec(
    `cross-env NODE_ENV=development MOCK=none UMI_UI=none umi dev ${encodeURIComponent(
      JSON.stringify(config),
    )}`,
    { async: true },
    () => {},
  );
})();
