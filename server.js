/**
 * Configuration
 */

var config = {
  username: 'silas',
  password: 'test'
};

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , BearerStrategy = require('passport-http-bearer').Strategy
  , jwt = require('jsonwebtoken')
  , r = require('rethinkdb')
  , bcrypt = require('bcrypt-nodejs')
  , argv = require('minimist')(process.argv.slice(2))

// handle program arguments
if (argv.createdb) {
  var createDB = true;
} else {
  var createDB = false;
}

// JWT tokens
// https://github.com/auth0/node-jsonwebtoken

var connection = null;

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
  if (err) throw err;

  connection = conn; 

  if (!createDB) {
    conn.use('webApp');
  }

  if (createDB) {
    if (!createDB) {
      r.dbDrop('webApp').run(conn, function(err, result) { if(err) throw err; });
    }

    r.dbCreate('webApp').run(conn, function(err, result) {
      if (err) throw err;
      r.db('webApp').tableCreate('users').run(conn, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));

        conn.use('webApp');

        r.table('users').indexCreate('username').run(conn, function(err, result) {
          if (err) throw err;
          console.log(JSON.stringify(result, null, 2));

          r.table('users').insert({
            username: config.username,
            password: bcrypt.hashSync(config.password),
          }).run(conn, function(err, result) {
            if (err) throw err;

            console.log(JSON.stringify(result, null, 2));
          })
        })

        r.table('users').indexCreate('token').run(conn, function(err, result) {
          if (err) throw err;
          console.log(JSON.stringify(result, null, 2));
        })

      })
    })
  }
});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  //app.use(express.cookieParser()); // auth
  app.use(express.bodyParser());
  //app.use(express.session({ secret: 'djdjdjdj'})); // auth
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(passport.initialize()); // auth
  //app.use(passport.session()); // auth
  app.use(app.router);
});

function findByToken(token, fn) {
  jwt.verify(token, 'need a better secret', function(err, decoded) {
    if (err) return fn(null, null);

    r.table('users').get(decoded.id).
      pluck('token').
      run(connection, function(err, result) {
        if (err) throw err;

        if (result.token == token) {
          return fn(null, decoded);
        } else {
          return fn(null, null);
        }
      })
  });
}

passport.serializeUser(function(user, done) {
  console.log('SerializeUser')
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('DeSerializeUser')
  done(null, user);
});

// Handle local authentication
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {

    r.db('webApp').table('users').getAll(username, {index: 'username'}).
      limit(1).
      pluck(['password', 'id']).
      run(connection, function(err, cursor) {
        if (err) throw err;

        cursor.toArray(function(err, result) {
          if (err) throw err;

          // If there are multiple users that get returned with the same
          // username, return the first one.
          var user = result[0]

          if (!user) {
            return done(null, false);
          }

          // verify the password that the user have with the encrypted
          // password in the system.
          //
          // If the password is good we will generate a new Bearer token
          // for the user and create a User object.
          //
          // We'll then update the `users` table with the token.
          if (bcrypt.compareSync(password, user.password)) {
            user = {id: user.id}

            var token = jwt.sign(user, 'need a better secret');
            user['token'] = token;

            r.table('users').
              get(user.id).
              update({token: token}).
              run(connection, function(err, result) {

                if (err) throw err;
              })

            return done(null, user);
          } else {
            return done(null, false);
          }
        })
      });
  })
}));

passport.use(new BearerStrategy({}, function(token, done) {
  console.log(token)
  process.nextTick(function() {
    findByToken(token, function(err, user) {
      if (err) return done(err);
      if (!user) { return done(null, false); }
      return done(null, user);
    })
  })
}));

app.configure('development', function(){
  app.use(express.errorHandler());
  app.set('view options', {pretty: true});
  app.locals.pretty = true;
});

app.get('/', routes.index);
// app.get('/users', user.list);

// Login with username/password and return a User object.
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.json(req.user)
  });

// Logout
//
// Require that the user be logged in.
// Update the user to make their current token `null` then log out the user.
app.get('/logout',
  passport.authenticate('bearer', {session: false}),
  function(req, res) {

    r.table('users').
      get(req.user.id).
      update({token: null}).run(connection, function(err, result) {

      if (err) throw err;

      req.logout();
    });

    res.end();
  });

// Authenticated web service.
//
// requires `access_token` GET param or `Authorization: Bearer TOKEN` header
// included in the request.
app.get('/api/me',
  passport.authenticate('bearer', {session: false}),
  function(req, res) {
    res.json({something: 'important'})
  });

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
