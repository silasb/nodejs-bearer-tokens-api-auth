var linksComponents = React.createClass({
  render: function() {
    if (App.auth()) {
      auth_links = [
        <li><a href="/events">Events</a></li>,
        <li><a href="/events/new">New Events</a></li>
      ]
    } else {
      auth_links = '';
    }

    return <ul>
        <li className={App.auth() ? 'hide' : ''}><a href="/login">Login</a></li>
        <li className={App.auth() ? '' : 'hide'}><a href="/logout">Logout</a></li>
        {auth_links}
    </ul>;
  }
});

module.exports = linksComponents;
