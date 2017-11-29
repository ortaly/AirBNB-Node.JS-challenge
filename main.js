const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const fs = require('fs');
const HttpsProxyAgent = require('https-proxy-agent');
const listing = require('./src/listing');


listing.search();


// reviewsParams = new URLSearchParams([
//     ['client_id', '3092nxybyb0otqw18e8nh5nty'],
//     ['role', 'all'],
//     ['listing_id', '13465986']
//   ]);

// fetch(`https://api.airbnb.com/v2/reviews?${reviewsParams.toString()}`, { agent:new HttpsProxyAgent('http://genproxy:8080')})
// .then(function(res) {
//     return res.json();
// }).then(body =>
//     fs.writeFile('../AirBNB-Node.JS-challenge/review.txt', JSON.stringify(body), function(err){
//         if(err){
//             return console.log("err=" + err);
//         }
//     })
//     // console.log(res);
// );
