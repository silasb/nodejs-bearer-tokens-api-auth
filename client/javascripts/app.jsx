/** @jsx React.DOM */

// redefines
window.request = superagent;

var routes = require('./routes');
var linksComponents = require('./components/links');

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
  },

  deleteAuth: function() {
    delete App._auth;
    localStorage.removeItem('auth');
  }
};

page()

// render the links component since it always stays up anyways.
React.renderComponent(<linksComponents />, document.getElementById('links'))
