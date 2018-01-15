
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const configs = require('./configs');
const HttpsProxyAgent = require('https-proxy-agent');
let params;

exports.checkAvailability = function(listingId, resolve) {
    let agent = {};

    function getStringDate(date){
        return date.getFullYear() + "-" + (date.getMonth + 1) + "-" + date.getDate();
    }

    let startDate = new Date(+new Date + 12096e5); //12096e5 = 14 days in milliseconds
    startDate = getStringDate(startDate);
    let endDate = new Date(+new Date - 12096e5);
    endDate = getStringDate(endDate);
    
    const searchCalenderParams = new URLSearchParams([
        ['client_id', configs.CLIENT_ID],
        ['listing_id', listingId],
        ['start_date', startDate],
        ['end_date', endDate]
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


