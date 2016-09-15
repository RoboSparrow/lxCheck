// dumb copy files

require('file?name=req/req.js!../req/req.js');
require('file?name=req/req.xapi.js!../req/req.xapi.js');

require('file?name=index.html!./index.html');
require('file?name=app.css!./app.css');

require('file?name=helper.js!./helper.js');

// bundle
require('./specs/about.js');
require('./specs/statement-api.js');
require('./specs/activity-state-api.js');
require('./specs/activity-profile-api.js');
require('./specs/agent-profile-api.js');
require('./specs/legacy-request-api.js');
