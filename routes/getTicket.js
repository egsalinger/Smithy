var express = require('express');
var router = express.Router();
var connection = require ("../model/database/connection");

/* GET users listing. */
router.get('/:ticketId', function(req, res, next) {
    console.log(req.params);
    connection.getTicket(req.params.ticketId, res);
});

module.exports = router;
