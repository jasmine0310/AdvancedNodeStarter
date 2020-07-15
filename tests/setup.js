require("../models/User");
const keys = require("../config/dev");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient : true});