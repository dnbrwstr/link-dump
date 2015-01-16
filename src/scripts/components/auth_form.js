var React = require('react'),
  IconEditor = require('components/icon_editor'),
  UserService = require('services/user_service');

var AuthForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      form: 'login',
      name: '',
      email: '',
      password: '',
      avatar: null,
      loading: false,
      loginError: null,
      registrationError: null
    };
  },

  componentDidMount: function () {
    var _this = this;

    UserService.on('login:error', function (err) {
      _this.setState({
        loading: false,
        loginError: err || 'Unable to log in'
      });
    });

    UserService.on('registration:error', function (err) {
      _this.setState({
        loading: false,
        registrationError: err || 'Unable to register'
      });
    });
  },

  render: function () {
    var classes = React.addons.classSet({
      'overlay': true,
      'is-active': this.props.active,
      'is-loading': this.state.loading
    });

    return (
      <div onClick={this.onClose} className={classes}>
        <div className="overlay-inner">
          <div className="auth-form ld-form" onClick={this.onClickForm}>
            <div className="ld-form-label">
              <a onClick={this.onShowLogin} className={this.getLinkClass('login')}>Login</a>&nbsp;/&nbsp;
              <a onClick={this.onShowSignup} className={this.getLinkClass('signup')}>Register</a>
            </div>

            { this.renderForm() }

            <div className="ld-form-close" onClick={this.onClose}>{ '\u00D7' }</div>
          </div>
        </div>
      </div>
    );
  },

  getLinkClass: function (linkName) {
    var className = linkName + '-link ';
    className += 'auth-form-link ';
    className += (linkName === this.state.form ? 'is-active' : '');
    return className;
  },

  renderForm : function () {
    return (
      <div className="register-form">
        { this.state.form === 'login' ? 
          <div className="login-form">
            <div className="ld-form-controls">
              <div className="ld-form-field-set">
                <input type="text" valueLink={this.linkState('email')} placeholder="Email" />
                <input type="password" valueLink={this.linkState('password')} placeholder="Password" />
              </div>

              { this.state.loginError &&
                <div className="ld-form-error">{this.state.loginError}</div> }

              <div className="ld-form-submit-container">
                <input type="submit" onClick={this.onSubmitLogin} value={this.state.loading ? 'Loading...' : 'Login'}/>
              </div>
            </div>
          </div>
        :
          <div className="ld-form-controls">
            <div className="ld-form-field-set">
              <div className="ld-form-avatar-editor">
                Draw an avatar
                <div className="ld-form-avatar-editor-inner">
                  <IconEditor onChange={this.onUpdateAvatar} />
                </div>
              </div>
              <input type="text" valueLink={this.linkState('name')} placeholder="Name" />
              <input type="text" valueLink={this.linkState('email')} placeholder="Email" />
              <input type="password" valueLink={this.linkState('password')} placeholder="Password" />
            </div>

            { this.state.registrationError &&
              <div className="ld-form-error">{this.state.registrationError}</div> }

            <div className="ld-form-submit-container">
              <input type="submit" onClick={this.onSubmitRegistration} value={this.state.loading ? 'Loading...' : 'Sign Up'}/>
            </div>
          </div>
        }
      </div>
    );
  },

  onClose: function () {
    this.props.onClose();
  },

  onClickForm: function (e) {
    e.stopPropagation();
  },

  onReset: function () {
    this.setState(this.getInitialState());
  },

  onShowLogin: function () {
    this.showForm('login');
  },

  onShowSignup: function () {
    this.showForm('signup');
  },

  showForm: function (formName) {
    this.setState({form: formName});
  },

  onSubmitLogin: function (e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    UserService.login(this.state.email, this.state.password);
  },

  onUpdateAvatar: function (data) {
    this.setState({
      avatar: data
    });
  },

  onSubmitRegistration: function (e) {
    e.preventDefault();

    this.setState({
      loading: true
    });
    
    UserService.createUser(this.state.email, this.state.password, {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.avatar
    });
  }

});

module.exports = AuthForm;
