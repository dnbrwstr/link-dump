var React = require('react'),
  Avatar = require('components/avatar');

var LinkStub = React.createClass({

  render: function () {
    var link = this.props.model.toJSON();

    return (
      <div className="link-stub">
        <div className="link-stub-avatar">
          <Avatar model={link.avatar} />
        </div>

        <a href={link.text} target="_blank">{link.text}</a>
        <div className="link-stub-username">{link.username}</div>
      </div>
    );
  }

});

module.exports = LinkStub;
