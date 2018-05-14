var express = require('express');
var router = express.Router();
var connection = require ("../model/database/connection");

/* GET users listing. */
router.get('/:ticketId', function(req, res) {
    console.log(req.params);
    connection.getTicket(req.params.ticketId, res, display);
});

module.exports = router;

function display (res, output) {
    if (output.error){
        res.render ('viewTicket', {title: output.error, description: output.error})
    } else {
        res.render ('viewTicket', output);
    }
}