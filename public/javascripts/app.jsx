/** @jsx React.DOM */

// redefines
var request = superagent;

// Main application state
App = {}

// Routing
page('/', function(ctx, next) {
  if (App.auth)
    React.renderComponent(EventListComponent(), $('.content')[0])
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

page('/events', is_user_signed_in, function(ctx) {
  request
    .get('/api/events')
    .set({'Authorization': 'Bearer ' + App.auth.token})
    .on('error', function(res) {
      console.log('failed to logout')
    })
    .end(function(res) {
      React.renderComponent(eventIndexComponent({events: res.body}), $('.content')[0])
    })
})

page('/events/:id', is_user_signed_in, function(ctx) {
  var id = ctx.params.id;

  React.renderComponent(eventComponent({id: id}), $('.content')[0])
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
    return <div className="row">
      <a href="#" onClick={this.handleClick}>/api/me</a>
    </div>
  }
})

var EventListComponent = React.createClass({
  componentDidMount: function() {
    $('#events-calendar').fullCalendar({
      height: 'auto',

      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
      },

      editable: true,
      selectable: true,
      selectHelper: true,

      select: function(start, end, event) {
        console.log(start)
        console.log(end)
        console.log(event)

        //$('#events-calendar').fullCalendar('renderEvent', {
          //title: 'hello world',
          //start: start,
          //end: end,
          //allDay: false
        //})

        $('#events-calendar').fullCalendar('unselect')
      }
    })

    var height = $('.header').innerHeight();

    $('.calendar-view').css('height', window.innerHeight - height - 50);

    //$('#events-calendar').fullCalendar('option', 'height', 'auto');
  },

  render: function() {
    return <div className="row">
      <div className="col-md-8 calendar-view">
        <div id="events-calendar"></div>
      </div>
      <div className="col-md-4">
        Stuff
      </div>
    </div>
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
      <form onClick={this.onSubmit} action="#" className="form">
        {this.props.children}
      </form>
    )
  }
})

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

var eventComponent = React.createClass({
  render: function() {
    var id = this.props.id;

    return <p>{id}</p>;
  }
})
