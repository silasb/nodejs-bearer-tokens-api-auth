/** @jsx React.DOM */

// redefines
window.request = superagent;

var routes = require('./routes');
var linksComponents = require('./components/links');

// Main application state
App = {}

// Start it
$(function() {
  page()

  // render the links component since it always stays up anyways.
  React.renderComponent(<linksComponents />, document.getElementById('links'))
})

// Components

