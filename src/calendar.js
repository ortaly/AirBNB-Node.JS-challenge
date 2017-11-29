
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const configs = require('./configs');
const HttpsProxyAgent = require('https-proxy-agent');
let params;

exports.checkAvailability = function(listingId, resolve) {
    let agent = {};
    if(process.env.USERDNSDOMAIN === "CORP.AMDOCS.COM"){
        agent = {agent: new HttpsProxyAgent('http://genproxy:8080')};
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    
    const searchCalenderParams = new URLSearchParams([
        ['client_id', configs.CLIENT_ID],
        ['listing_id', listingId],
        // TODO: calc dates
        ['start_date', '2017-11-13'],
        ['end_date', '2017-12-13']
    ]);
    const availabilityObj = {};

    fetch(`https://api.airbnb.com/v2/calendar_days?${searchCalenderParams.toString()}`, agent)
        .then(function (res) {
            return res.json();
        }).then(body => {
            resolve(body);
        }, function(err){
            console.log("ERR! : " , err);
        });

        
} 
