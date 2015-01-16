var makeService = require('lib/make_service');

var UserService = makeService({
  
  getUser: function () {
    return Parse.User.current();
  },

  login: function (username, password) {
    return Parse.User.logIn(username, password)
      .then(this.triggerChange, this.triggerLoginError);
  },

  logout: function () {
    Parse.User.logOut()
    this.triggerChange();
  },

  createUser: function (username, password, attrs) {
    return Parse.User.signUp(username, password, attrs)
      .then(this.login.bind(this, username, password), this.triggerRegistrationError);
  },

  triggerLoginError: function (e) {
    this.trigger('login:error', [e.message]);
  },

  triggerRegistrationError: function (e) {
    this.trigger('registration:error', [e.message]);
  }

});

module.exports = UserService;
