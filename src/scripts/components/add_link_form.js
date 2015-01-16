var React = require('react'),
  LinkService = require('services/link_service'),
  UserService = require('services/user_service');

var AddLinkForm = React.createClass({

  getInitialState: function () {
    return {
      value: '', 
      valid: true
    };
  },
 
  render: function () {
    var classes = React.addons.classSet({
      'add-link-form': true,
      'is-active': this.props.active,
      'is-valid': this.state.valid,
      'is-invalid': !this.state.valid
    });

    return (
      <div className={classes}>
        <input 
          type="text" 
          placeholder="url" 
          value={this.state.value}
          onChange={this.onChange} 
          onKeyUp={this.onKeyUp} />

        <a className="add-link-form-add-button" onClick={this.onSubmit}>
          Add
        </a>
      </div>
    );
  },

  onChange: function (e) {
    var isValid = !!this.getFormattedLink() || this.state.value.length < 3;

    this.setState({
      value: e.target.value,
      valid: isValid
    });
  },

  onKeyUp: function (e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  },

  onSubmit: function () {
    var link = this.getFormattedLink();
    var user = UserService.getUser();

    if (!link) return;

    LinkService.createLink({
      text: link,
      username: user.get('name'),
      avatar: user.get('avatar')
    });
  
    this.setState({
      value: ''
    });
  },

  getFormattedLink: function () {
    var val = this.state.value;
    val = val.replace(/^\s+/, '').replace('\s+$', '');

    if (val.match(/\s/g)) {
      return false;
    }

    var protocol = val.split('://').shift();
    if (protocol !== val && protocol !== 'http' && protocol !== 'https') {
      return false;
    }

    var host = val.split('://').pop().split('/').shift();
    var hostParts = host.split('.');
    if (hostParts.length < 2) {
      return false;
    }

    if (protocol === val) {
      val = 'http://' + val;
    }

    return val;
  }

});

module.exports = AddLinkForm;
