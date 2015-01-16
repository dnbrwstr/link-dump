var React = require('react'),
  config = require('config'),
  App = require('components/app');

Parse.initialize(config.parseApplicationId, config.parseJavascriptKey);

React.renderComponent(<App />, document.getElementById('app-root'));
