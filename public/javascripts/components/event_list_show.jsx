var eventComponent = React.createClass({
  render: function() {
    var id = this.props.id;

    return <p>{id}</p>;
  }
})

module.exports = eventComponent;
