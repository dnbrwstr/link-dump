var config = {
  parseApplicationId: null,
  parseJavascriptKey: null
};

if (config.parseJavascriptKey === '' || config.parseApplicationId === '') {
  throw new Error('Please specify your parse javascript key and application id in config.js');
}

module.exports = config;
