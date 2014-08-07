var DashboardComponent = React.createClass({
  handleClick: function(e) {
    e.preventDefault();

    request
      .get('/api/me')
      .set({'Authorization': 'Bearer ' + App.auth().token})
      .on('error', function(res) {
        console.log('failed')
      })
      .end(function(res) {
        console.log('success')
      })
  },

  render: function() {
    return <div className="row">
      <a href="#" onClick={this.handleClick}>/api/me</a>
    </div>
  }
})

module.exports = DashboardComponent;
