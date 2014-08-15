var EventCreateComponent = React.createClass({

  handleSubmit: function() {
    var title = this.refs.title.getDOMNode();
    var description = this.refs.description.getDOMNode();

    var title_valid = title.value != '';

    // not sure how I want to handle validations yet
    if (true) {
      request
        .post('/api/events')
        .set({'Authorization': 'Bearer ' + App.auth().token})
        .send({event: {title: title.value, description: description.value}})
        .on('error', function(res) {
          console.log('failed to logout')
        })
        .end(function(res) {
          page('/events')
        })
    }

    return false;
  },

  render: function() {

    return <div>
      <h1>Event Create</h1>

      <form onSubmit={this.handleSubmit} role="form">

        <div className="form-group">
          <label htmlFor="event_title">Title:</label>
          <input type="text" name="title" ref="title" id="event_title" className="form-control" placeholder="Title of event" />
        </div>

        <div className="form-group">
          <label htmlFor="event_description">Description:</label>
          <textarea name="description" rows="3" ref="description" id="event_description" className="form-control" placeholder="Description of event" />
        </div>

        <input className="btn btn-default" type="submit" value="Create Event" />
      </form>
    </div>
  }
});

module.exports = EventCreateComponent;
