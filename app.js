require('dotenv').config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const routes = require("./routes/index");
const passport = require("passport");

connectDB();

const app = express();

if (process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(routes);

app.use(passport.initialize())
require("./config/passport")(passport);



const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Server running in " + process.env.NODE_ENV + " mode on " + PORT)
});
