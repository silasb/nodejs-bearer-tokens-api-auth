# Token Based Auth + Express + React

This method of authentication is using `bearer` token to easily create a token consumable via AJAX and through the CLI.

# Requirements

* rethinkdb
* nodejs
* bower

## Startup

In one terminal:

	rethinkdb

In another terminal (first use):

	npm install
	bower install
	node server.js --createdb

After initial install and DB setup:

	node server.js
