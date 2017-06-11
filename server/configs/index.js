const express = require('express');
const bodyParser = require('body-parser');

module.exports = {
    apiKey: '45843212',
    apiSecret: '6b719d141adb02a1e43d0465956e74842b9df114',
    httpsPort: '8080',
    port : process.env.PORT || 6969,
    // mongoUrl : 'mongodb://127.0.0.1/learn-jp',
    mongoUrl : (process.env.NODE_ENV === "production") ? 'mongodb://phanmduong:duong1997@ds133211.mlab.com:33211/learn-jp'
                    : 'mongodb://127.0.0.1/learn-jp'
    ,
    settingExpress : (app) => {
        app.use(bodyParser.urlencoded({ extended : false}));

        app.use(bodyParser.json());
    },
    secret: 'learn-jp'
}