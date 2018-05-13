var express = require('express');
var router = express.Router();
var connection = require ("../model/database/connection");
require ("../utilities/utils");


/* POST users listing. */
router.post('/', function(req, res) {
    var name = req.body.ticketName;
    var description = req.body.ticketDescription;
    if (name && description) {
        connection.addTicket(res, name, description);
    } else {
        res.send("Invalid params passed. You sent:\nName: {0}\nDescription: {1}".formatUnicorn(name, description));
        return;
    }
});

module.exports = router;
