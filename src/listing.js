
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const configs = require('./configs');
const calendar = require('./calendar');
const HttpsProxyAgent = require('https-proxy-agent');
const queue = require('queue');
let params;

exports.search = function() {

    let agent = {};

    function getSearchResults(page, searchResults){
        let url = `https://api.airbnb.com/search/search_results?client_id=${configs.CLIENT_ID}&location=${configs.LOCATION}&page=${page}`;
        console.log("url: " + url); 
        fetch(url, {})
            .then(function (res) {
                return res.json();
            }).then(body => {
                if (!body.results_json.metadata.pagination.result_count){
                    fs.writeFile('./result.txt', JSON.stringify(searchResults), function (err) {
                        if (err) {
                            return console.log("err=" + err);
                        }
                    });
                    processFile(searchResults);
                }
                else {
                    searchResults = searchResults.concat(body.results_json.search_results);
                    page += 1; 
                    setTimeout(function(){
                        console.log("get page: " + page); 
                        console.log("searchResults length: " + searchResults.length);                    
                        getSearchResults(page, searchResults);
                    }, 10000);
                }
                // fs.writeFile('./result.txt', JSON.stringify(body), function (err) {
                //     if (err) {
                //         return console.log("err=" + err);
                //     }
                // })
            } , function(err){
                console.log("ERR! : " , err);
                fs.writeFile('./result.txt', JSON.stringify(searchResults), function (err) {
                    if (err) {
                        return console.log("err=" + err);
                    }
                });
                processFile(searchResults);
            });

    }

    getSearchResults(1, []);

    // fs.readFile('./result.txt', function read(err, data){
    //     if (err) {
    //         throw err;
    //     }
    //     content = JSON.parse(data);
    //     processFile(); 
    // });


    function processFile(searchResults) {
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
                console.log('data: ' + JSON.stringify(data));
                availbilityResults.push(data);
            });
            
        });

        resultsQueue.start(function (err) {
            if (err) throw err
            console.log('all done!' + availbilityResults.length);
            fs.writeFile('./result2.txt', JSON.stringify(availbilityResults), function (err) {
                            if (err) {
                                return console.log("err=" + err);
                            }
                        })
            // console.log(JSON.stringify(availbilityResults));
        });
    }
       
        
    

} 
