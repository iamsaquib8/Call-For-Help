const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const request = require('request');

const keys = require('../../config/keys');


const router = express.Router();

router.post('/smsUser', passport.authenticate('jwt', {session: false}), (req, res) => {
    const url = keys.smsUrl +
                keys.smsKey + 
                '&message=' + 
                req.body.message + 
                '&sender=BULKSMS&to=' + 
                req.body.mobile + 
                '&method=sms';
    request.get(url)
        .on('response', function(response) {
        console.log(response.statusCode) // 200
        res.json(response)
    }) 
})

router.post('/callUser', passport.authenticate('jwt', {session: false}), (req, res) => {
    const url = keys.voiceUrl +
                keys.voiceKey + 
                '&method=dial.click2call&caller=' + 
                req.user[0].mobile + 
                '&receiver=' + 
                req.body.mobile;
    request.get(url)
        .on('response', function(response) {
        console.log(response.statusCode) // 200
        res.json(response)
    }) 
})

router.post('/signal', passport.authenticate('jwt', {session: false}), (req, res) => {
    let resp;
    req.user[0].connection.map(connection => {
        let url = keys.smsUrl +
                keys.smsKey + 
                '&message=' + 
                req.body.message + 
                '&sender=BULKSMS&to=' + 
                connection.mobile + 
                '&method=sms';
        request.get(url)
            .on('response', function(response) {// 200
                resp = response.statusCode;     
        })
    })
    res.json({success: true})
})
module.exports = router;