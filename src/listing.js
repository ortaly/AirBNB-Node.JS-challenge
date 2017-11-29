
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const configs = require('./configs');
const calendar = require('./calendar');
const HttpsProxyAgent = require('https-proxy-agent');
const queue = require('queue');
let params;

exports.search = function() {
    const searchListingParams = new URLSearchParams([
        ['client_id', configs.CLIENT_ID],
        ['location', configs.LOCATION],
        ['page', 2],
        // ['price_min', 3500],
    ]);

    let agent = {};
    if(process.env.USERDNSDOMAIN === "CORP.AMDOCS.COM"){
        agent = {agent: new HttpsProxyAgent('http://genproxy:8080')};
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    

    fetch(`https://api.airbnb.com/search/search_results?${searchListingParams.toString()}`, agent)
        .then(function (res) {
            return res.json();
        }).then(body => 
            processFile(body)
            // fs.writeFile('./result.txt', JSON.stringify(body), function (err) {
            //     if (err) {
            //         return console.log("err=" + err);
            //     }
            // })
        // console.log(res);
        , function(err){
            console.log("ERR! : " , err);
        });

    // fs.readFile('./result.txt', function read(err, data){
    //     if (err) {
    //         throw err;
    //     }
    //     content = JSON.parse(data);
    //     processFile(); 
    // });

    function processFile(content) {
        const searchResults = content.results_json.search_results;
        let resultsQueue = queue(); 
        resultsQueue.concurrency = 1;
        const availbilityResults = [];
        searchResults.map(function(listingObj){
            return new Promise(function(resolve, reject) {
                resultsQueue.push(function(cb){
                    // resultsQueue.stop();
                    listingId = listingObj.listing.id;
                    // console.log("listing.id:"+ listingId);
                    calendar.checkAvailability(listingId, resolve);
                    setTimeout(function(){
                        console.log('start next');
                        cb();
                        // resultsQueue.start();
                    }, 5000);
                });
            }).then(function(data){
                availbilityResults.push(data);
            });
            
        });

        resultsQueue.start(function (err) {
            if (err) throw err
            console.log('all done!' + availbilityResults.length);
            fs.writeFile('./result.txt', JSON.stringify(availbilityResults), function (err) {
                            if (err) {
                                return console.log("err=" + err);
                            }
                        })
            // console.log(JSON.stringify(availbilityResults));
        });
    }
       
        
    

} 
