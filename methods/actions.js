var User = require("../models/user");
var jwt = require("jwt-simple");
var config = require("../config/dbconfig");
var bcrypt = require("bcrypt");
const dbconfig = require("../config/dbconfig");

const saltRounds = 10;

var functions = {
    addNew: function(req, res){
        if((!req.body.name) || (!req.body.password)){
            res.json({success: false, msg: "Error, Enter all fields"});
        } else {

            checkUser();

            function checkUser(){
                User.findOne({name:req.body.name}, function(err, foundUser){
                    if(err){
                        console.log(err);
                    }
                    if(foundUser){
                        res.json({success: false, msg: "User Exist! Change user name"})
                    } else {

                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            bcrypt.hash(req.body.password, salt, function(err, hash) {
                                // Store hash in your password DB.
                                var newUser = User({
                                    name: req.body.name,
                                    password: hash
                                });
                                newUser.save(function(err){
                                    if(!err){
                                        res.json({success: true, msg:"Successfully saved User"});
                                    }
                                });
            
                            });
                        });

                    }
                });
            }

            

           
        }
    },

    authenticate: function(req, res){
        User.findOne({name: req.body.name}, function(err, foundUser){
            if(err){
                console.log(err);
            }
            if(!foundUser){
                res.status(403).json({success: false, msg: "Authentication failed, No user found!"});
            }
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    // result == true
                    if(err){
                        console.log(err);
                    }
                    else if(result){
                        var token = jwt.encode(foundUser, dbconfig.secret);
                        res.json({success: true, msg: "Successfully authenticated", token: token});
                    } else {
                        res.json({success: false, msg: "wrong password"})
                    }
                });
            }
        })
    },

    getInfo: function(req, res){
        if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer"){
            var token = req.headers.authorization.split(" ")[1];
            var decodedToken = jwt.decode(token, dbconfig.secret);
            return res.json({success: true, msg: "Hello " + decodedToken.name});
        } else {
            return res.json({success: false, msg: "No headers"});
        }
    }

}


module.exports = functions;