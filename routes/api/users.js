const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');


const router = express.Router();


//Load User Model
const User = require('../../models/User');

//@route GET api/users/current
//@desc return current user
//@access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
})


//@route POST api/users/register
//@desc resgister post route
//@access Public
router.post('/register', (req, res) => {
    console.log(req.body)
    User
        .findOne({email: req.body.email} )
        .then(user => {
            if(user){
                return res.status(400).json({ success : false, msg: 'Email Already Exists'});
            } else {    
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    mobile: req.body.mobile
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(() => res.status(200).json({ success: true, msg: 'Registration Successful'}))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
        .catch(err => res.json(err))
});

//@route POST api/users/login
//@desc login post route
//@access Public
router.post('/authenticate', (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 

    //Find user by email
    User
        .findOne({email})
        .then( user => {

            //check for user
            if(!user) {
                return res.status(404).json({ success: false, msg: 'User not found'})
            } 

            //check password
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //User Matched
                        
                        //Create JWT Payload
                        const payload = {
                            email: user.email,
                            name: user.name
                        }
                        //Sign Token
                        
                        jwt.sign(
                            payload,
                            keys.secretOrKey, 
                            { expiresIn: 86400 },
                            (err, token) => {
                                res
                                    .status(200)
                                    .json({
                                        success: true,
                                        token: 'Bearer ' + token, 
                                        msg: 'Login Successful'})        
                            }
                        );
                        
                    } else {
                        res.status(400).json({success: false, msg: 'Invalid Credentials'})
                    }
                })
        })
});


router.post('/userbymobile',  passport.authenticate('jwt', {session: false}), (req,res)=> {
    console.log(req.body)
    User
        .findOne({mobile: req.body.mobile})
        .then((user) => {
            res.json({success: true, msg: {
                name: user.name,
                mobile: user.mobile
            }})
        })
});

const checkConn = (conn, m) =>{
    return new Promise((req, res) => {
        let flag = 0;
        conn.map(data => {
            if(data.mobile === m){
                flag =1; 
                resolve(flag);
            }
        })
        reject(flag);
    })
}

router.post('/connect', passport.authenticate('jwt', {session: false}), (req, res) => {
    const connection = {
        name: req.body.name,
        mobile : req.body.mobile
    };
    let flag = 0;
    checkConn(req.user[0].connection, req.body.mobile)
    .then(data => {
            User
            .updateOne(
            { email: req.user[0].email }, 
            { $push: { connection} })
            .then(() => { res.json({success:true, msg:"done"})})
    })
    .catch(err => {
        res.json({success: false, msg: "already present"})
    })
});

module.exports = router;