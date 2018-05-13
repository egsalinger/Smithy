
var mysql = require ('mysql');
var uuid = require ('uuid/v4');
var uuidParser = require ('uuid-parse');

var options ={
// turn this on for debug info
    debug: "false",

    port: 3306,
    host: "localhost",
    user: "root",
    password: "dummypassword",
    database: "forge"
};
var connection = mysql.createConnection(options);

module.exports = {
    listRows: function()
    {
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            try {
                connection.query('SELECT count(id) from forge.tickets', function (error, results, fields) {
                    if (error) throw error;
                    connection.end();
                    res.send("Found {0} rows.".formatUnicorn(results.toString()));
                });
                connection.end();
            } catch (error){
                console.log ("Error! " + error);
                connection.end();
                res.send("Error: " + error);
            }
        });
    },
    addTicket: function(res, name, description) {
        var guid = uuid();
        var post = {ticketName: name, ticketDescription: description, guid: Buffer.from(uuidParser.parse(guid))}
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            try {
                connection.query('INSERT INTO forge.tickets SET ?', post, function (error, results, fields) {
                    if (error) throw error;
                    connection.end();
                    res.send("Created a ticket sucessfully. Guid: {0}".formatUnicorn(guid));
                });
                connection.end();
            } catch (error){
                console.log ("Error! " + error);
                connection.end();
                res.send("Error: " + error);
            }
        });
    },

    getTicket: function(guid, res) {
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            try {
                var buffer = Buffer.from(uuidParser.parse(guid));
                connection.query('SELECT * from forge.tickets WHERE guid = ?', {guid: buffer}, function (error, results, fields) {
                    if (error) throw error;
                    connection.end();
                    res.send("Found {0} rows.".formatUnicorn(results.toString()));
                });
                connection.end();
            } catch (error){
                console.log ("Error! " + error);
                connection.end();
                res.send("Error: " + error);
            }
        });
    }
}
