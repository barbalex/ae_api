require("source-map-support").install()
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * startet die Anwendung, indem der Server gestartet wird
	 */
	
	'use strict'
	
	const app = __webpack_require__(1)
	const server = __webpack_require__(2)
	const pgp = __webpack_require__(123)()
	const config = __webpack_require__(15)
	
	server.start((err) => {
	  if (err) throw err
	  const db = pgp(config.pg.connectionString)
	  app.extend({
	    init() {
	      this.db = db
	    }
	  })
	  app.init()
	  console.log(`Server running at:`, server.info.uri)
	})


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = commonjsampersand-app;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {/**
	 * startet die Anwendung, indem der Server gestartet wird
	 */
	
	'use strict'
	
	const Hapi = __webpack_require__(3)
	const Inert = __webpack_require__(4)
	const Vision = __webpack_require__(5)
	const Lout = __webpack_require__(6)
	const HapiAuthCookie = __webpack_require__(7)
	const glob = __webpack_require__(8)
	const path = __webpack_require__(9)
	const dbConnection = __webpack_require__(10)()
	const cookiePassword = __webpack_require__(11)
	// wird nur in Entwicklung genutzt
	// in new Hapi.Server() einsetzen
	let serverOptions = {
	  debug: {
	    log: ['error'],
	    request: ['error']
	  }
	}
	if (process.env.NODE_ENV === 'production') {
	  serverOptions = {}
	  const createServer = __webpack_require__(12)
	  const secureServer = createServer({
	    email: 'alex@gabriel-software.ch', // Emailed when certificates expire
	    agreeTos: true, // Required for letsencrypt
	    debug: true, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
	    domains: ['artliste.ch'], // List of accepted domain names. (You can use nested arrays to register bundles with LE)
	    forceSSL: true, // Make this false to disable auto http->https redirects (default true)
	    ports: {
	      http: 80, // Optionally override the default http port
	      https: 443 // Optionally override the default https port
	    }
	  })
	  // Server is a "https.createServer" instance.
	  secureServer.once('listening', () => {
	    console.log('We are ready to go.')  // eslint-disable-line no-console
	  })
	  // add auto-sni methods to dbConnection
	  dbConnection.listener = secureServer
	  dbConnection.autoListen = false
	  dbConnection.tls = true
	}
	const server = new Hapi.Server(serverOptions)
	server.connection(dbConnection)
	
	const loutConfig = {
	  register: Lout,
	  options: {
	    endpoint: 'api'
	  }
	}
	
	server.register([Inert, HapiAuthCookie, Vision, loutConfig], (error) => {
	  if (error) console.log('failed loading server plugins')  // eslint-disable-line no-console
	  server.auth.strategy('session', 'cookie', true, {
	    password: cookiePassword,
	    cookie: 'ae-cookie',
	    ttl: 24 * 60 * 60 * 1000, // set session to 1 day
	    isSecure: process.env.NODE_ENV !== 'development' // bad idea but necessary to run on http
	  })
	  // add all the routes
	  glob.sync('src/routes/**/*.js', { root: __dirname }).forEach((file) =>
	    server.route(__webpack_require__(13)(`./${file}`))
	  )
	  // non-Query routes hat to be separated
	  // because when testing directory handler produces an error
	  glob.sync('src/nonQueryRoutes/**/*.js', { root: __dirname }).forEach((file) =>
	    server.route(__webpack_require__(13)(`./${file}`))
	  )
	})
	
	module.exports = server
	
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = commonjshapi;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = commonjsinert;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = commonjsvision;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = commonjslout;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = commonjshapi-auth-cookie;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = commonjsglob;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = () => {
	  const connection = {
	    host: `0.0.0.0`,
	    routes: {
	      cors: true
	    }
	  }
	  if (process.env.NODE_ENV === `development`) {
	    connection.port = 8000
	  }
	  return connection
	}


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = `this schall become a very long and secret password when it is finished`


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = commonjsauto-sni;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./alexPassword": 14,
		"./alexPassword.js": 14,
		"./configuration": 15,
		"./configuration.js": 15,
		"./cookiePassword": 11,
		"./cookiePassword.js": 11,
		"./dbConnection": 10,
		"./dbConnection.js": 10,
		"./dbPass": 16,
		"./dbPass.json": 16,
		"./gulp-tasks/prod_clean_dist": 17,
		"./gulp-tasks/prod_clean_dist.js": 17,
		"./gulp-tasks/prod_copy": 20,
		"./gulp-tasks/prod_copy.js": 20,
		"./gulp-tasks/prod_copy_etc_to_dist": 22,
		"./gulp-tasks/prod_copy_etc_to_dist.js": 22,
		"./gulp-tasks/prod_copy_geojson_to_dist": 23,
		"./gulp-tasks/prod_copy_geojson_to_dist.js": 23,
		"./gulp-tasks/prod_copy_img_to_dist": 24,
		"./gulp-tasks/prod_copy_img_to_dist.js": 24,
		"./gulp-tasks/prod_copy_kml_to_dist": 25,
		"./gulp-tasks/prod_copy_kml_to_dist.js": 25,
		"./gulp-tasks/prod_copy_queries_to_dist": 26,
		"./gulp-tasks/prod_copy_queries_to_dist.js": 26,
		"./gulp-tasks/prod_copy_root_to_dist": 27,
		"./gulp-tasks/prod_copy_root_to_dist.js": 27,
		"./gulp-tasks/prod_copy_src_to_dist": 28,
		"./gulp-tasks/prod_copy_src_to_dist.js": 28,
		"./gulp-tasks/prod_sftp": 29,
		"./gulp-tasks/prod_sftp.js": 29,
		"./gulpfile": 32,
		"./gulpfile.js": 32,
		"./license.md": 33,
		"./package": 34,
		"./package.json": 34,
		"./secretKey": 35,
		"./secretKey.js": 35,
		"./server": 2,
		"./server.js": 2,
		"./sftpPass": 31,
		"./sftpPass.json": 31,
		"./src/escapeStringForSql": 36,
		"./src/escapeStringForSql.js": 36,
		"./src/exportData": 37,
		"./src/exportData.js": 37,
		"./src/getObjectById": 38,
		"./src/getObjectById.js": 38,
		"./src/getPropertyCollectionsByObject": 39,
		"./src/getPropertyCollectionsByObject.js": 39,
		"./src/getRelationCollectionsByObject": 41,
		"./src/getRelationCollectionsByObject.js": 41,
		"./src/getRelationPartnersByRelation": 43,
		"./src/getRelationPartnersByRelation.js": 43,
		"./src/getRelationsByORC": 42,
		"./src/getRelationsByORC.js": 42,
		"./src/getTaxonomies": 44,
		"./src/getTaxonomies.js": 44,
		"./src/getTaxonomiesByObject": 45,
		"./src/getTaxonomiesByObject.js": 45,
		"./src/getUsers": 46,
		"./src/getUsers.js": 46,
		"./src/handlers/objectById": 47,
		"./src/handlers/objectById.js": 47,
		"./src/handlers/taxonomies": 49,
		"./src/handlers/taxonomies.js": 49,
		"./src/handlers/users/create": 50,
		"./src/handlers/users/create.js": 50,
		"./src/handlers/users/login": 53,
		"./src/handlers/users/login.js": 53,
		"./src/handlers/users/logout": 56,
		"./src/handlers/users/logout.js": 56,
		"./src/handlers/users/users": 57,
		"./src/handlers/users/users.js": 57,
		"./src/hashPassword": 51,
		"./src/hashPassword.js": 51,
		"./src/nonQueryRoutes/nonQueries": 58,
		"./src/nonQueryRoutes/nonQueries.js": 58,
		"./src/routes/exportData": 59,
		"./src/routes/exportData.js": 59,
		"./src/routes/object": 60,
		"./src/routes/object.js": 60,
		"./src/routes/taxonomies": 62,
		"./src/routes/taxonomies.js": 62,
		"./src/routes/users/create": 63,
		"./src/routes/users/create.js": 63,
		"./src/routes/users/login": 65,
		"./src/routes/users/login.js": 65,
		"./src/routes/users/logout": 66,
		"./src/routes/users/logout.js": 66,
		"./src/routes/users/users": 67,
		"./src/routes/users/users.js": 67,
		"./src/verifyUniqueUser": 64,
		"./src/verifyUniqueUser.js": 64,
		"./src/verifyUser": 55,
		"./src/verifyUser.js": 55
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 13;


/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = 'HknvWAY3zMZd'


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Hier werden zentral alle Konfigurationsparameter gesammelt
	 */
	
	'use strict'
	
	const config = {}
	const dbPass = __webpack_require__(16)
	
	config.db = {}
	config.pg = {}
	config.pg.userName = dbPass.user
	config.pg.passWord = dbPass.pass
	config.pg.connectionString = `postgres://${dbPass.user}:${dbPass.pass}@localhost:5432/ae`
	
	module.exports = config


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = {
		"user": "postgres",
		"pass": "3Q2ernEv51dr"
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	const del = __webpack_require__(19)
	
	gulp.task('prod_clean_dist', function (cb) {
	  del(['dist'], cb)
	})


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = commonjsgulp;

/***/ },
/* 19 */
/***/ function(module, exports) {

	module.exports = commonjsdel;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	const requireDir = __webpack_require__(21)
	
	requireDir('../gulp-tasks', { recurse: true })
	
	gulp.task(
	  'prod_copy',
	  function () {
	    gulp.start([
	      'prod_copy_geojson_to_dist',
	      'prod_copy_src_to_dist',
	      'prod_copy_queries_to_dist',
	      'prod_copy_img_to_dist',
	      'prod_copy_kml_to_dist',
	      'prod_copy_etc_to_dist',
	      'prod_copy_root_to_dist'
	    ])
	  }
	)


/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = commonjsrequire-dir;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_etc_to_dist', function () {
	  return gulp.src('etc/*')
	    .pipe(gulp.dest('dist/etc'))
	})


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_geojson_to_dist', function () {
	  return gulp.src('geojson/*')
	    .pipe(gulp.dest('dist/geojson'))
	})


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_img_to_dist', function () {
	  return gulp.src('img/*')
	    .pipe(gulp.dest('dist/img'))
	})


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_kml_to_dist', function () {
	  return gulp.src('kml/*')
	    .pipe(gulp.dest('dist/kml'))
	})


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_queries_to_dist', function () {
	  return gulp.src('src/handlers/**/*')
	    .pipe(gulp.dest('dist/handlers'))
	})


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_root_to_dist', function () {
	  return gulp.src([
	    'configuration.js',
	    'server.js',
	    'package.json',
	    'License.md',
	    'README.md',
	    'dbConnection.js',
	    'pgPlugin.js',
	    'startServer.js'
	  ])
	    .pipe(gulp.dest('dist/'))
	})


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const gulp = __webpack_require__(18)
	
	gulp.task('prod_copy_src_to_dist', function () {
	  return gulp.src(['src/**/*'])
	    .pipe(gulp.dest('dist/src'))
	})


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * beamt die Dateien aus dem dist-Ordner nach apflora.ch
	 */
	
	'use strict'
	
	const gulp = __webpack_require__(18)
	var sftp = __webpack_require__(30)
	var requireDir = __webpack_require__(21)
	var sftpPass = __webpack_require__(31)
	
	requireDir('../gulp-tasks', {recurse: true})
	
	gulp.task('prod_sftp', function () {
	  return gulp.src('dist/**/*')
	    .pipe(sftp({
	      // host: 'api.apflora.ch',
	      host: '46.101.153.44',
	      port: 30000,
	      remotePath: 'apflora',
	      user: sftpPass.user,
	      pass: sftpPass.pass
	    }))
	})


/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = commonjsgulp-sftp;

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = {
		"user": "alex",
		"pass": "3Q2ernEv51dr"
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*
	
	 Quelle: https://github.com/greypants/gulp-starter
	
	 gulpfile.js
	 ===========
	 Rather than manage one giant configuration file responsible
	 for creating multiple tasks, each task has been broken out into
	 its own file in gulp/tasks. Any files in that directory get
	 automatically required below.
	
	 To add a new task, simply add a new task file that directory.
	 gulp/tasks/default.js specifies the default set of tasks to run
	 when you run `gulp`.
	 */
	
	const requireDir = __webpack_require__(21)
	
	// initiate modularized tasks
	requireDir('./gulp-tasks', { recurse: true })


/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = "<p>Copyright (c) 2014, Amt für Landschaft und Natur Kanton Zürich</p>\n<p>Alle Rechte vorbehalten.</p>\n<p>Weiterverbreitung und Verwendung mit oder ohne Veränderung, gratis oder kostenpflichtig, sind zulässig, wenn das obige Copyright, diese Liste der Bedingungen und der folgende Haftungsausschluss enthalten sind.</p>\n<p>DIESE SOFTWARE WIRD VOM RECHTEINHABER UND DEN BEITRAGSLEISTENDEN OHNE JEGLICHE SPEZIELLE ODER IMPLIZIERTE GARANTIEN ZUR VERFÜGUNG GESTELLT, DIE UNTER ANDEREM EINSCHLIESSEN: DIE IMPLIZIERTE GARANTIE DER VERWENDBARKEIT DER SOFTWARE FÜR EINEN BESTIMMTEN ZWECK. AUF KEINEN FALL SIND DER RECHTEINHABER ODER DIE BEITRAGSLEISTENDEN FÜR IRGENDWELCHE DIREKTEN, INDIREKTEN, ZUFÄLLIGEN, SPEZIELLEN, BEISPIELHAFTEN ODER FOLGESCHÄDEN (UNTER ANDEREM VERSCHAFFEN VON ERSATZGÜTERN ODER -DIENSTLEISTUNGEN; EINSCHRÄNKUNG DER NUTZUNGSFÄHIGKEIT; VERLUST VON NUTZUNGSFÄHIGKEIT; DATEN; PROFIT ODER GESCHÄFTSUNTERBRECHUNG), WIE AUCH IMMER VERURSACHT UND UNTER WELCHER VERPFLICHTUNG AUCH IMMER, OB IN VERTRAG, STRIKTER VERPFLICHTUNG ODER UNERLAUBTER HANDLUNG (INKLUSIVE FAHRLÄSSIGKEIT) VERANTWORTLICH, AUF WELCHEM WEG SIE AUCH IMMER DURCH DIE BENUTZUNG DIESER SOFTWARE ENTSTANDEN SIND, SOGAR, WENN SIE AUF DIE MÖGLICHKEIT EINES SOLCHEN SCHADENS HINGEWIESEN WORDEN SIND.</p>\n<p>Dies ist eine übersetzte Version der ISC-Lizenz (<a href=\"https://en.wikipedia.org/wiki/ISC_license\">https://en.wikipedia.org/wiki/ISC_license</a>).</p>\n";

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = {
		"name": "ae_api",
		"version": "0.0.1",
		"description": "backend for arteigenschaften.ch",
		"main": "index.js",
		"scripts": {
			"dev": "set NODE_ENV=development&& nodemon startServer.js",
			"start": "sudo setcap cap_net_bind_service=+ep $(which node) && set NODE_ENV=production && node startServer.js",
			"test": "eslint src/**",
			"yolo": "gulp sftp_src && gulp sftp_top"
		},
		"repository": {
			"type": "git",
			"url": "git+https://github.com/barbalex/ae_api.git"
		},
		"author": "Alexander Gabriel",
		"license": "ISC",
		"bugs": {
			"url": "https://github.com/barbalex/ae_api/issues"
		},
		"homepage": "https://github.com/barbalex/ae_api#readme",
		"dependencies": {
			"ampersand-app": "2.0.0",
			"bcrypt": "0.8.7",
			"boom": "3.2.2",
			"glob": "7.0.5",
			"hapi": "13.5.0",
			"hapi-auth-cookie": "6.1.1",
			"inert": "4.0.1",
			"joi": "8.4.2",
			"lodash": "4.13.1",
			"lout": "9.0.1",
			"node-uuid": "1.4.7",
			"pg-promise": "5.1.0",
			"uuid": "2.0.2",
			"vision": "4.1.0"
		},
		"devDependencies": {
			"babel-eslint": "6.1.0",
			"code": "3.0.1",
			"del": "2.2.1",
			"eslint": "3.0.1",
			"eslint-config-airbnb": "9.0.1",
			"eslint-plugin-import": "1.10.2",
			"eslint-plugin-jsx-a11y": "1.5.5",
			"eslint-plugin-react": "5.2.2",
			"gulp": "3.9.1",
			"gulp-sftp": "0.1.5",
			"lab": "10.8.2",
			"nodemon": "1.9.2",
			"require-dir": "0.3.0",
			"run-sequence": "1.2.2"
		}
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = `secret`


/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = (str) => {
	  if (str) {
	    if (typeof str === `string`) {
	      return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
	        switch (char) {
	          case `\0`:
	            return `\\0`
	          case `\x08`:
	            return `\\b`
	          case `\x09`:
	            return `\\t`
	          case `\x1a`:
	            return `\\z`
	          case `\n`:
	            return `\\n`
	          case `\r`:
	            return `\\r`
	          case `"`:
	          case "'":  /* eslint quotes:0 */
	          case `\\`:
	          case `%`:
	            return `\\${char}` // prepends a backslash to backslash, percent and double/single quotes
	          default:
	            return char
	        }
	      })
	    }
	    return str
	  }
	}


/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict'
	
	/**
	 * receives options for export
	 * returns export data
	 */
	
	module.exports = (request, callback) => {
	  return null
	  /*
	  const {
	    exportOptions,
	    onlyObjectsWithCollectionData,
	    includeDataFromSynonyms,
	    oneRowPerRelation,
	    combineTaxonomies
	  } = request.params
	  const dbUrl = `${couchUrl()}/artendb`
	  // connect do users db
	  new PouchDB(dbUrl)
	    // get all objects
	    .then((db) => db.allDocs({ include_docs: true }))
	    .then((result) => {
	      const objects = result.rows.map((row) => row.doc)
	    })
	    // return roles to caller
	    .then((doc) => callback(null, doc.roles))
	    // inform caller of error
	    .catch((error) => callback(error, null))
	  */
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = (id) =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        *
	      FROM
	        ae.object
	      WHERE
	        id = $1
	    `
	    app.db.one(sql, [id])
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no object received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = (id) =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        ae.property_collection.*,
	        ae.property_collection_object.properties
	      FROM
	        ae.property_collection_object
	        INNER JOIN ae.property_collection
	        ON property_collection.id = ae.property_collection_object.property_collection_id
	      WHERE
	        object_id = $1
	    `
	    app.db.many(sql, [id])
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no object_property_collections received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 40 */,
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	const getRelationsByORC = __webpack_require__(42)
	
	module.exports = (object_id) =>
	  new Promise((resolve, reject) => {
	    let relationCollections
	    const sql = `
	      SELECT
	        ae.relation_collection_object.relation_collection_id,
	        ae.relation_collection.*
	      FROM
	        ae.relation_collection_object
	        INNER JOIN ae.relation_collection
	        ON relation_collection.id = ae.relation_collection_object.relation_collection_id
	      WHERE
	        object_id = $1
	    `
	    app.db.many(sql, [object_id])
	      .then((data) => {
	        if (data) {
	          relationCollections = data
	        } else {
	          return reject(`no object_relation_collections received from db`)
	        }
	        return Promise.all(relationCollections.map((oRC) =>
	          getRelationsByORC(object_id, oRC.relation_collection_id))
	        )
	      })
	      .then((relationsArray) => {
	        relationCollections = relationCollections.map((oRC, index) => {
	          delete oRC.relation_collection_id
	          oRC.relations = relationsArray[index]
	          return oRC
	        })
	        resolve(relationCollections)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	const getRelationPartnersByRelation = __webpack_require__(43)
	
	module.exports = (object_id, relation_collection_id) =>
	  new Promise((resolve, reject) => {
	    let relations
	    const sql = `
	      SELECT
	        id,
	        properties
	      FROM
	        ae.relation
	      WHERE
	        object_id = $1 AND
	        relation_collection_id = $2
	    `
	    app.db.many(sql, [object_id, relation_collection_id])
	      .then((data) => {
	        if (data) {
	          relations = data
	        } else {
	          return reject(`no relations received from db`)
	        }
	        return Promise.all(relations.map((relation) =>
	          getRelationPartnersByRelation(relation.id))
	        )
	      })
	      .then((relationPartnersArray) => {
	        relations = relations.map((relation, index) => {
	          relation.relationPartners = relationPartnersArray[index]
	          return relation
	        })
	        resolve(relations)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = (relation_id) =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        object_id
	      FROM
	        ae.relation_partner
	      WHERE
	        relation_id = $1
	    `
	    app.db.many(sql, [relation_id])
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no relation_partner received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = () =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        *
	      FROM
	        ae.taxonomy
	    `
	    app.db.many(sql)
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no taxonomies received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = (object_id) =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        ae.taxonomy.id,
	        ae.taxonomy.name AS taxonomy_name,
	        ae.taxonomy.description,
	        ae.taxonomy.links,
	        ae.taxonomy.last_updated,
	        ae.taxonomy.organization_id,
	        ae.taxonomy.category,
	        ae.taxonomy.is_category_standard,
	        ae.taxonomy_object.parent_id,
	        ae.taxonomy_object.name AS object_name,
	        ae.taxonomy_object.properties
	      FROM
	        ae.taxonomy_object
	        INNER JOIN ae.taxonomy
	        ON taxonomy.id = ae.taxonomy_object.taxonomy_id
	      WHERE
	        object_id = $1
	    `
	    app.db.many(sql, [object_id])
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no object_taxonomies received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	
	module.exports = () =>
	  new Promise((resolve, reject) => {
	    const sql = `
	      SELECT
	        *
	      FROM
	        ae.user
	    `
	    app.db.many(sql)
	      .then((data) => {
	        if (data) return resolve(data)
	        reject(`no users received from db`)
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	/**
	 * builds an object of the form:
	 * {
	 *   id: xxx,
	 *   category: xxx,
	 *   organization_id: xxx,
	 *   relationCollections: [
	 *     {
	 *       id: xxx,
	 *       name: xxx,
	 *       description: xxx,
	 *       links: xxx,
	 *       nature_of_relation: xxx,
	 *       combining: xxx,
	 *       organization_id: xxx,
	 *       last_updated: xxx,
	 *       terms_of_use: xxx,
	 *       imported_by: xxx,
	 *       relations: [
	 *         {
	 *           id: xxx,
	 *           properties: xxx,
	 *           relationPartners: [
	 *             {
	 *               object_id: xxx
	 *             }
	 *           ]
	 *         }
	 *       ]
	 *     }
	 *   ],
	 *   propertyCollections: [
	 *     {
	 *       id: xxx,
	 *       name: xxx,
	 *       description: xxx,
	 *       links: xxx,
	 *       combining: xxx,
	 *       organization_id: xxx,
	 *       last_updated: xxx,
	 *       terms_of_use: xxx,
	 *       imported_by: xxx,
	 *       properties: xxx
	 *     }
	 *   ],
	 *   taxonomies: [
	 *     {
	 *       id: xxx,
	 *       taxonomy_name: xxx,
	 *       description: xxx,
	 *       links: xxx,
	 *       last_updated: xxx,
	 *       organization_id: xxx,
	 *       category: xxx,
	 *       is_category_standard: xxx,
	 *       parent_id: xxx,
	 *       object_name: xxx,
	 *       properties: xxx
	 *     }
	 *   ]
	 * }
	 */
	
	const Boom = __webpack_require__(48)
	const getObjectById = __webpack_require__(38)
	const getRelationCollectionsByObject = __webpack_require__(41)
	const getPropertyCollectionsByObject = __webpack_require__(39)
	const getTaxonomiesByObject = __webpack_require__(45)
	const escapeStringForSql = __webpack_require__(36)
	
	module.exports = (request, reply) => {
	  const id = escapeStringForSql(request.params.id)
	  let object
	
	  getObjectById(id)
	    .then((data) => {
	      object = data
	      return getRelationCollectionsByObject(id)
	    })
	    .then((relationCollections) => {
	      object.relationCollections = relationCollections
	      return getPropertyCollectionsByObject(id)
	    })
	    .then((propertyCollections) => {
	      object.propertyCollections = propertyCollections
	      return getTaxonomiesByObject(id)
	    })
	    .then((taxonomies) => {
	      object.taxonomies = taxonomies
	      return
	    })
	    .then(() => reply(null, object))
	    .catch((error) =>
	      reply(Boom.badImplementation(error), null)
	    )
	}


/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = commonjsboom;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Boom = __webpack_require__(48)
	const getTaxonomies = __webpack_require__(44)
	
	module.exports = (request, reply) => {
	  getTaxonomies()
	    .then((taxonomies) => {
	      if (taxonomies && taxonomies.length) {
	        return reply(null, taxonomies)
	      }
	      throw `no taxonomies received`  /* eslint no-throw-literal:0 */
	    })
	    .catch((error) =>
	      reply(Boom.badImplementation(error), null)
	    )
	}


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	const Boom = __webpack_require__(48)
	const hashPassword = __webpack_require__(51)
	
	module.exports = (request, reply) => {
	  const { name, email, password } = request.payload
	
	  hashPassword(password)
	    // save user in db
	    .then((hash) =>
	      app.db.none(`
	        INSERT INTO ae.user (name,email,password)
	        VALUES ('${name}','${email}','${hash}')
	      `)
	    )
	    .then(() =>
	      reply(`Ein neuer Benutzer Namens ${name} wurde erstellt`)
	    )
	    .catch((error) =>
	      reply(Boom.badImplementation(error), null)
	    )
	}


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const bcrypt = __webpack_require__(52)
	
	module.exports = (password) =>
	  new Promise((resolve, reject) => {
	    bcrypt.genSalt(10, (error, salt) => {
	      if (error) return reject(error)
	      bcrypt.hash(password, salt, (error2, hash) => {
	        if (error2) return reject(error2)
	        resolve(hash)
	      })
	    })
	  })


/***/ },
/* 52 */
/***/ function(module, exports) {

	module.exports = commonjsbcrypt;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Boom = __webpack_require__(48)
	const uuid = __webpack_require__(54)
	const verifyUser = __webpack_require__(55)
	
	module.exports = (request, reply) => {
	  const { name, password } = request.payload
	  verifyUser(name, password)
	    .then((user) => {
	      console.log('login.js, user', user)
	      if (user === null || !Object.keys(user).length) {
	        return reply(Boom.unauthorized(`Ungültiger Name oder Passwort`))
	      }
	      delete user.password
	      // TODO: this produces an error
	      // find out, how to create a session and make hapi return a cookie
	      console.log(`request.auth`, request.auth)
	      const sid = uuid.v4()
	      request.cookieAuth.set({ sid })
	      reply(`Willkommen ${user.name}!`)
	    })
	    .catch(() => reply(Boom.badImplementation()))
	}


/***/ },
/* 54 */
/***/ function(module, exports) {

	module.exports = commonjsuuid;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	const bcrypt = __webpack_require__(52)
	
	module.exports = (name, password) =>
	  new Promise((resolve, reject) => {
	    /**
	     * find a user in the db with this name
	     */
	    const sql = `
	      SELECT
	        *
	      FROM
	        ae.user
	      WHERE
	        name = $1
	    `
	    app.db.one(sql, [name])
	      .then((user) => {
	        if (!Object.keys(user)) {
	          return resolve()
	        }
	        bcrypt.compare(
	          password,
	          user.password,
	          (err, isValid) => {
	            console.log('isValid', isValid)
	            if (isValid) {
	              return resolve(user)
	            }
	            resolve(null)
	          }
	        )
	      })
	      .catch((error) => reject(error))
	  })


/***/ },
/* 56 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = (request, reply) => {
	  request.cookieAuth.clear()
	  return reply(`erfolgreich abgemeldet`)
	}


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Boom = __webpack_require__(48)
	const getUsers = __webpack_require__(46)
	
	module.exports = (request, reply) => {
	  getUsers()
	    .then((users) => {
	      if (users && users.length) {
	        return reply(null, users)
	      }
	      throw `no users received`  /* eslint no-throw-literal:0 */
	    })
	    .catch((error) =>
	      reply(Boom.badImplementation(error), null)
	    )
	}


/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict'
	
	module.exports = [
	  {
	    method: `GET`,
	    path: `/{path*}`,
	    handler(request, reply) {
	      reply.file(`index.html`)
	    }
	  },
	  {
	    method: `GET`,
	    path: `/src/{param*}`,
	    handler: {
	      directory: {
	        path: `src`
	      }
	    }
	  },
	  {
	    method: `GET`,
	    path: `/style/{param*}`,
	    handler: {
	      directory: {
	        path: `style`
	      }
	    }
	  },
	  {
	    method: `GET`,
	    path: `/style/images/{param*}`,
	    handler: {
	      directory: {
	        path: `style/images`
	      }
	    }
	  }
	]


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const exportData = __webpack_require__(37)
	
	module.exports = {
	  method: `GET`,
	  path: `/exportData/{combineTaxonomies}/{oneRowPerRelation}/{includeDataFromSynonyms}/{onlyObjectsWithCollectionData}/{exportOptions}`,
	  handler: exportData
	}


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Joi = __webpack_require__(61)
	const objectById = __webpack_require__(47)
	
	module.exports = {
	  method: `GET`,
	  path: `/object/{id}`,
	  handler: objectById,
	  config: {
	    validate: {
	      params: {
	        id: Joi.string().guid()
	      }
	    },
	    auth: false
	  }
	}


/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = commonjsjoi;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const taxonomies = __webpack_require__(49)
	
	module.exports = {
	  method: `GET`,
	  path: `/taxonomies`,
	  handler: taxonomies,
	  config: {
	    auth: false
	  }
	}


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Joi = __webpack_require__(61)
	const verifyUniqueUser = __webpack_require__(64)
	const createUser = __webpack_require__(50)
	
	module.exports = {
	  method: `POST`,
	  path: `/users`,
	  handler: createUser,
	  config: {
	    pre: [
	      { method: verifyUniqueUser }
	    ],
	    validate: {
	      payload: {
	        name: Joi.string().min(2).max(200).required(),
	        email: Joi.string().email().required(),
	        password: Joi.string().min(2).max(200).required()
	      }
	    },
	    auth: false
	  }
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const app = __webpack_require__(1)
	const Boom = __webpack_require__(48)
	
	module.exports = (request, reply) => {
	  const { name, email } = request.payload
	  /**
	   * Check whether the username or email
	   * is already taken and error out if so
	   */
	  const sql = `
	    SELECT
	      *
	    FROM
	      ae.user
	  `
	  app.db.many(sql)
	    .then((users) => {
	      const userWithSameName = users.find((user) => user.name === name)
	      const userWithSameEmail = users.find((user) => user.email === email)
	      if (userWithSameName) {
	        reply(Boom.badRequest('Der Benutzername wird schon verwendet'))
	      } else if (userWithSameEmail) {
	        reply(Boom.badRequest('Die Email-Adresse wird schon verwendet'))
	      } else {
	        /**
	         * everything checks out, so send the payload through
	         * to the route handler
	         */
	        reply(request.payload)
	      }
	    })
	    .catch((error) =>
	      reply(Boom.badImplementation(error))
	    )
	}


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const Joi = __webpack_require__(61)
	const login = __webpack_require__(53)
	
	module.exports = {
	  method: `POST`,
	  path: `/users/login`,
	  handler: login,
	  config: {
	    validate: {
	      payload: {
	        name: Joi.string().min(2).max(200).required(),
	        password: Joi.string().min(2).max(200).required()
	      }
	    },
	    auth: false
	  }
	}


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const logout = __webpack_require__(56)
	
	module.exports = {
	  method: `GET`,
	  path: `/users/logout`,
	  handler: logout
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	
	const users = __webpack_require__(57)
	
	module.exports = {
	  method: `GET`,
	  path: `/users`,
	  handler: users,
	  config: {
	    auth: {
	      strategy: `session`,
	      scope: [`admin`]
	    },
	    plugins: {
	      lout: false
	    }
	  }
	}


/***/ },
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */
/***/ function(module, exports) {

	module.exports = commonjspg-promise;

/***/ }
/******/ ]);
//# sourceMappingURL=backend.js.map