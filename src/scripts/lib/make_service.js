var EventEmitter = require('wolfy87-eventemitter');

module.exports = function (serviceProps) {
  var service = Object.create(EventEmitter.prototype);

  for (var key in serviceProps) {
    var val = serviceProps[key];

    if (typeof val === 'function') { 
      val = val.bind(service);
    }

    service[key] = val;
  }

  service.triggerChange = function () {
    this.trigger('change');
  }.bind(service);

  return service;
};
