/** @jsx React.DOM */

var loginComponent = require('./components/login');
var linksComponents = require('./components/links');
var EventListComponent = require('./components/event_list');
var eventIndexComponent = require('./components/event_list_index');
var eventComponent = require('./components/event_list_show');
var EventCreateComponent = require('./components/event_create');

// Routing
page('/', function(ctx, next) {
  if (App.auth())
    React.renderComponent(<EventListComponent />, $('.content')[0])
  else
    React.renderComponent(<loginComponent />, $('.content')[0] )
})

page('/login', function(ctx, next) {
  React.renderComponent(<loginComponent />, $('.content')[0] )
})

page('/logout', is_user_signed_in, function(ctx) {
  request
    .get('/logout')
    .set({'Authorization': 'Bearer ' + App.auth().token})
    .on('error', function(res) {
      console.log('failed to logout')
    })
    .end(function(res) {
      App.deleteAuth();

      React.renderComponent(<linksComponents />, document.getElementById('links'))

      page('/')
    })
})

page('/events', is_user_signed_in, function(ctx) {
  request
    .get('/api/events')
    .set({'Authorization': 'Bearer ' + App.auth().token})
    .on('error', function(res) {
      console.log('failed to logout')
    })
    .end(function(res) {
      React.renderComponent(<eventIndexComponent events={res.body} />, $('.content')[0])
    })
})

page('/events/new', is_user_signed_in, function(ctx) {
  React.renderComponent(<EventCreateComponent />, $('.content')[0])
})

page('/events/:id', is_user_signed_in, function(ctx) {
  var id = ctx.params.id;

  React.renderComponent(<eventComponent id={id} />, $('.content')[0])
})

page('*', notfound)

function notfound(ctx, next) {
  console.log('not found')
}

function is_user_signed_in(ctx, next) {
  if (App.auth())
    next()
  else
    page('/')

};
