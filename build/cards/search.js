'use strict';

var GoogleImages = require('google-images');

var client = new GoogleImages('006697023441604425649:qgitldlfnu8', 'AIzaSyCvfr5g5P82lq_65eoCUjPZnDKM8AQQ1iw');

client.search('Steve Angello').then(function (images) {
    /*
    [{
        "url": "http://steveangello.com/boss.jpg",
        "type": "image/jpeg",
        "width": 1024,
        "height": 768,
        "size": 102451,
        "thumbnail": {
            "url": "http://steveangello.com/thumbnail.jpg",
            "width": 512,
            "height": 512
        }
    }]
     */
});

// paginate results
client.search('Steve Angello', { page: 2 });

// search for certain size
client.search('Steve Angello', { size: 'large' });