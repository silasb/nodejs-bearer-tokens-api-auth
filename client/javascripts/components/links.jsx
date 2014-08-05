var linksComponents = React.createClass({
  render: function() {
    if (App.hasOwnProperty('auth')) {
      auth_links = <li><a href="/events">Events</a></li>
    } else {
      auth_links = '';
    }

    return <ul>
        <li className={App.hasOwnProperty('auth') ? 'hide' : ''}><a href="/login">Login</a></li>
        <li className={App.hasOwnProperty('auth') ? '' : 'hide'}><a href="/logout">Logout</a></li>
        {auth_links}
    </ul>;
  }
});

module.exports = linksComponents;
