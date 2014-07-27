/** @jsx React.DOM */

// redefines
var request = superagent;

// Main application state
App = {}

// Routing
page('/', function(ctx, next) {
  if (App.auth)
    React.renderComponent(DashboardComponent(), $('.content')[0])
  else
    React.renderComponent(loginComponent(), $('.content')[0] )
})

page('/login', function(ctx, next) {
  React.renderComponent(loginComponent(), $('.content')[0] )
})

page('/logout', is_user_signed_in, function(ctx) {
  request
    .get('/logout')
    .set({'Authorization': 'Bearer ' + App.auth.token})
    .on('error', function(res) {
      console.log('failed to logout')
    })
    .end(function(res) {
      delete App.auth

      React.renderComponent(linksComponents(), document.getElementById('links'))

      page('/')
    })
})

page('*', notfound)

function notfound(ctx, next) {
  console.log('not found')
}

function is_user_signed_in(ctx, next) {
  if (App.auth)
    next()
  else
    page('/')
};

// Start it
$(function() {
  page()

  // render the links component since it always stays up anyways.
  React.renderComponent(linksComponents(), document.getElementById('links'))
})

// Components

var DashboardComponent = React.createClass({
  handleClick: function(e) {
    e.preventDefault();

    request
      .get('/api/me')
      .set({'Authorization': 'Bearer ' + App.auth.token})
      .on('error', function(res) {
        console.log('failed')
      })
      .end(function(res) {
        console.log('success')
      })
  },

  render: function() {
    return <a href="#" onClick={this.handleClick}>/api/me</a>
  }
})

var FlashComponent = React.createClass({
  getInitialState: function() {
    return {shown: false, message: ''}
  },
  componentWillMount: function() {
    this.setState({
      shown: this.props.shown,
      message: this.props.message,
    });
  },

  render: function() {
    return <div className={this.state.shown ? 'alert alert-danger show' : 'hide'}>{this.state.message}</div>
  }
})

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

          React.renderComponent(FlashComponent({shown: true, message: 'Incorrect username or password.'}), document.getElementById('flash'))
        } else {
          auth = JSON.parse(res.text)

          App.auth = auth;

          React.renderComponent(linksComponents(), document.getElementById('links'))
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
    return <Form callback={this.handleLogin}>
        <label>Username:
          <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
        </label>
        <br/>
        <label>Password:
          <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
        </label>
        <br/>
        <button onClick={this.handleLogin}>Login</button>
      </Form>
  },
})


// Taken from here:
// http://clozeit.wordpress.com/2014/01/13/bootstrap-forms-using-react-js/
var Form = React.createClass({
  onSubmit: function(e) {
    e.preventDefault();
    // if (e.target.type == 'submit')
      // this.props.cal
  },

  render: function() {
    return this.transferPropsTo(
      <form onClick={this.onSubmit} action="#">
        {this.props.children}
      </form>
    )
  }
})

var linksComponents = React.createClass({
  render: function() {
    return <ul>
        <li className={App.hasOwnProperty('auth') ? 'hide' : ''}><a href="/login">Login</a></li>
        <li className={App.hasOwnProperty('auth') ? '' : 'hide'}><a href="/logout">Logout</a></li>
    </ul>;
  }
});

