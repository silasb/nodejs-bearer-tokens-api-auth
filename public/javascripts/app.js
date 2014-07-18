/** @jsx React.DOM */

App = {}

// setup ajax to catch all 401 not authorized errors.
// $.ajaxSetup({
//   statusCode: {
//     401: function(err){
//       console.log('Login Failed.', err.responseJSON);
//       // or whatever...
//     }
//   }
// });

var app = Sammy('.content', function() {
  //this._checkFormSubmission = function(form) {
    //return false;
  //};

  this.get('#/', function() {
    // React.renderComponent(Hello({ name: 'world'}), document.getElementById('components') )
    React.renderComponent(loginComponent(), $('.content')[0] )
  })

  this.post('#/login', function(ctx) {

    // console.log($.param(ctx.params.toHash()))

    $.post('/login', $.param(ctx.params.toHash())).
      success(function(auth) {
        console.log(auth)

        App.auth = auth;

        // ctx.swap('hello')
        ctx.redirect('#/dashboard')
      }).
      fail(function(res) {
        if (res.state == 401) {
          console.log('not authorized')
        }
      })

    return false
  })

  this.get('#/login', function(ctx) {
    React.renderComponent(loginComponent(), $('.content')[0] )
  })

  this.get('#/logout', function(ctx) {
    $.ajax({
      url: '/logout',
      type: 'GET',
      headers: {'Authorization': 'Bearer ' + App.auth.token},
    }).
      done(function(res) { delete App.auth }).
      fail(function(res) { console.log('failed to logout')})

    React.renderComponent(linksComponents(), document.getElementById('links'))

    ctx.redirect('#/')
  })

  this.before('#/dashboard', function() {
    if (!App.auth){
      this.redirect('#/login')
    }
  })

  this.get('#/dashboard', function(ctx) {
    React.renderComponent(DashboardComponent(), $('.content')[0])
  })
})

DOM = React.DOM,
div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, input = DOM.input, form = DOM.form

var DashboardComponent = React.createClass({
  handleClick: function(e) {
    e.preventDefault();

    $.ajax({
      url: '/api/me',
      type: 'GET',
      headers: {'Authorization': 'Bearer ' + App.auth.token},
      // beforeSend: function(xhs) {xhr.setRequestHeader('X-Token', App.auth.token)},
      // success: function() {console.log('success')}
    }).
      done(function(res) { console.log('success')}).
      fail(function(res) { console.log('fail')})
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

    $.ajax({
        url: '/login',
        type: 'POST',
        data: $.param(this.state),
      }).
      done(function(data, textStatus, jqXHR) {
        console.log(data)

        App.auth = data;

        React.renderComponent(linksComponents(), document.getElementById('links'))
        React.unmountComponentAtNode(document.getElementById('flash'))

        window.location = '#/dashboard'
      }).
      fail(function(jqXHR) {
        if (jqXHR.status == 401) {
          console.log('not authorized')

          React.renderComponent(FlashComponent({shown: true, message: 'Incorrect username or password.'}), document.getElementById('flash'))
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
        <li className={App.hasOwnProperty('auth') ? 'hide' : ''}><a href="#/login">Login</a></li>
        <li className={App.hasOwnProperty('auth') ? '' : 'hide'}><a href="#/logout">Logout</a></li>
    </ul>;
  }
});

// render the links component since it always stays up anyways.
React.renderComponent(linksComponents(), document.getElementById('links'))

// Run it!
app.run('#/')