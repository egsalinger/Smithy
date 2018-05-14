var express = require('express');
var router = express.Router();
var connection = require ("../model/database/connection");

/* GET home page. Return all of the tickets we've created so far. */
router.get('', function(req, res) {
    connection.listRows(res, display);
});
module.exports = router;

function display (res, output) {
    var title = "Smithy";
    if (Array.isArray(output)){
        res.render ('index', {title: title, tickets: output});
    } else {
        res.render ('index', {title: title, error: output})
    }
}

