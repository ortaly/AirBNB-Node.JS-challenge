const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const HttpsProxyAgent = require('https-proxy-agent');
const listing = require('./src/listing');


listing.search();
