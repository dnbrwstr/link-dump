var React = require('react'), 
  AddLinkForm = require('components/add_link_form'),
  AuthForm = require('components/auth_form'),
  LinkList = require('components/link_list'),
  UserService = require('services/user_service');

var AppView = React.createClass({

  getInitialState: function () {
    return {
      user: UserService.getUser(),
      showAuthModal: false
    };
  },

  componentDidMount: function () {
    UserService.on('change', this.updateUser);
  },

  updateUser: function () {
    this.setState({
      user: UserService.getUser()
    });
  },

  render: function () {
    var user = this.state.user;

    return (
      <div className="application">
        <div className="app-header">
          <div className="auth-links">
            { this.state.user ?
              <div>
                { "Welcome, " + user.get('name') + ' '} 
                <a className="logout-link" onClick={this.onLogout}>Logout</a>
              </div>
            :
              <a className="login-link" onClick={this.onToggleAuthForm}>Login / Register</a>
            }
          </div>

          { this.state.user && 
            <AddLinkForm /> }
        </div>

        <LinkList />

        { !this.state.user && this.state.showAuthModal &&
          <AuthForm onClose={this.onToggleAuthForm} /> }   
      </div>
    );
  },

  onToggleAuthForm: function () {
    this.setState({
      showAuthModal: !this.state.showAuthModal
    });
  },

  onLogout: function () {
    UserService.logout();
  }

});

module.exports = AppView;
