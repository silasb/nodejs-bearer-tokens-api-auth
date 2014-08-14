/** @jsx React.DOM */

// redefines
window.request = superagent;

var routes = require('./routes');
var linksComponents = require('./components/links');
var loginComponent = require('./components/login');

// Main application state
App = {
  auth: function() {
    if (App._auth == undefined) {
      App.loadAuth()
      return App._auth;
    } else {
      return App._auth;
    }
  },

  saveAuth: function(auth) {
    App._auth = auth;
    json_auth = JSON.stringify(App._auth)
    localStorage.setItem('auth', json_auth);
  },

  loadAuth: function() {
    App._auth = JSON.parse(localStorage.getItem('auth'))

    if (App._auth == undefined) {
      return page('/login')
    }

    request
      .get('/api/me')
      .set({'Authorization': 'Bearer ' + App._auth.token})
      .end(function(error, res) {
        if (res.status == 401) {
          App.deleteAuth()
          page('/login')
        }
      })
  },

  deleteAuth: function() {
    delete App._auth;
    localStorage.removeItem('auth');
  }
};

page()

// render the links component since it always stays up anyways.
React.renderComponent(<linksComponents />, document.getElementById('links'))
