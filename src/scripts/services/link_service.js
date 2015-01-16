var makeService = require('lib/make_service'),
  Link = require('models/link');

var  links = [];

var LinkService = makeService({

  loadLinks: function () {
    new Parse.Query(Link)
      .descending('createdAt')
      .find()
      .then(function (results) {
        links = results;
      })
      .then(this.triggerChange, this.triggerLoadError);
  },

  getLinks: function () {
    return links;
  },

  createLink: function (attrs) {
    var acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);

    attrs.ACL = acl;

    new Link(attrs).save()
      .then(this.loadLinks, this.triggerCreateError);
  },

  triggerRegistrationError: function (e) {
    this.trigger('load:error', [e.message]);
  },

  triggerCreateError: function (e) {
    this.trigger('create:error', [e.message]);
  }

});

module.exports = LinkService;
