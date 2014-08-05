var eventIndexComponent = React.createClass({
  render: function() {
    events = this.props.events;
    event_list = []

    for(var event in events) {
      var el = <li>
          <a href={'/events/' + events[event].id}>{events[event].name}</a>
        </li>;

      event_list.push(el)
    }

    return <ul>
      {event_list}
    </ul>;
  }
})

module.exports = eventIndexComponent;
