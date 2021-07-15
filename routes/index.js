var express = require("express");
var router = express.Router();
var actions = require("../methods/actions");

router.get("/", function(req, res){
    res.send("Hello world");
});

/// Add User //
router.post("/adduser", actions.addNew);

router.post("/authenticate", actions.authenticate);

router.get("/getinfo", actions.getInfo);



module.exports = router;