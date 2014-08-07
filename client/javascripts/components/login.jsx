var Form = require('./form');
var linksComponents = require('./links');
var FlashComponent = require('./flash');

var loginComponent = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered
  getInitialState: function() {
    return {username: '', password: '', showFlash: false, flash: ''}
  },

  handleChange: function(event) {
    var attr = {};
    attr[event.target.name] = event.target.value
    this.setState(attr)
  },

  // Then we just update the state whenever its clicked - but you could imagine
  // this being updated with the results of AJAX calls, etc
  handleLogin: function() {
    var $this = this;

    request
      .post('/login')
      .send($.param(this.state))
      .on('error', function() {
        console.log('5xx error')
      })
      .end(function(res) {
        if (res.status == 401) {
          console.log('not authorized')

          React.renderComponent(<FlashComponent shown='true' message='Incorrect username or password.' />, document.getElementById('flash'))
        } else {
          auth = JSON.parse(res.text)

          App.saveAuth(auth);

          React.renderComponent(<linksComponents />, document.getElementById('links'))
          React.unmountComponentAtNode(document.getElementById('flash'))

          page('/')
        }
      })
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled depending on the props passed
  // in, so we can render it disabled initially, and then enable it when
  // everything has loaded
  render: function() {
    return <div className="row">
      <div className="col-md-4 col-md-offset-4">
        <Form callback={this.handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input name="username" type="text" value={this.state.username} onChange={this.handleChange} className="form-control" />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input name="password" type="password" value={this.state.password} onChange={this.handleChange} className="form-control" />

          </div>

          <button onClick={this.handleLogin} className="btn btn-default">Login</button>
        </Form>
      </div>
    </div>
  },
})

module.exports = loginComponent;
