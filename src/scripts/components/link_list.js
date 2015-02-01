var moment = require('moment'), 
  React = require('react'),
  LinkService = require('services/link_service'),
  LinkStub = require('components/link_stub');

var LinkList = React.createClass({

  getInitialState: function () {
    return {
      links: LinkService.getLinks()
    };
  },

  componentDidMount: function () {
    LinkService.loadLinks();
    LinkService.on('change', this.updateLinks);
  },

  updateLinks: function () {
    this.setState({
      links: LinkService.getLinks()
    });
  },

  render: function () {
    return (
      <div className="link-list">
        { this.getGroupedLinks().map(function (group) {
          return (
            <div className="link-group">
              <div className="link-group-date">{group.date}</div>
              { group.links.map(function (link) {
                return (<LinkStub model={link} />);
              }) }
            </div>
          );
        }) }
      </div>
    );
  },

  getGroupedLinks: function () {
    var dates = this.state.links.reduce(function (memo, item) {
      var date = moment(item.createdAt).format('MMM Do');

      if (!memo[date]) {
        memo[date] = [];
      }

      memo[date].push(item);

      return memo;
    }, {});

    var groups = [];
    for (var key in dates) {
      groups.push({
        date: key,
        links: dates[key]
      });
    }

    return groups.sort(function (a, b) {
      var dateA = new Date(a.links[0].createdAt);
      var dateB = new Date(b.links[0].createdAt);

      if (dateA > dateB) {
        return -1;
      } else if (dateA < dateB) {
        return 1;
      } else {
        return 0;
      }
    });
  }

});

module.exports = LinkList;
