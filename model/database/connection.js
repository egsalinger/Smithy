
var mysql = require ('mysql');
var uuid = require ('uuid/v4');
var uuidParser = require ('uuid-parse');

var options ={
// turn this on for debug info
//    debug: "false",

    port: 3306,
    host: "localhost",
    user: "root",
    password: "dummypassword",
    database: "forge"
};

module.exports = {
    listRows: function(res, out)
    {
        var connection = mysql.createConnection(options);
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                res.render('index', { title: 'My smithy.', error: err});

                return;
            }
            console.log('connected as id ' + connection.threadId);
            try {
                connection.query('SELECT * from forge.tickets', function (error, results, fields) {
                    if (error) throw error;
                    var output = processListResults(results);
                    out (res, output);
                });
            } catch (error){
                console.log ("Error! " + error);
                out (res, error);
            } finally
            {
                connection.end();
            }
        });
    },
    addTicket: function(res, name, description) {
        var connection = mysql.createConnection(options);
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

    getTicket: function(guid, res, out) {
        var connection = mysql.createConnection(options);
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            try {
                var buffer = Buffer.from(uuidParser.parse(guid));
                connection.query('SELECT * from forge.tickets WHERE ?', {guid: buffer}, function (error, results, fields) {
                    if (error) throw error;
                    var output = processGetResult(results)
                    out(res, output);
                });
            } catch (error){
                console.log ("Error! " + error);
                out (res, error)
            } finally {
                connection.end();
            }
        });
    }
}

function processListResults(results) {
    var tickets = [];
    results.forEach(function (item){
        tickets.push ({name: item.ticketName, details: item.ticketDescription, guid: uuidParser.unparse(item.guid)});
    });
    return tickets;
}

function processGetResult (results) {
    if (results.length !=1) {
        return {error: "Invalid result from the server."}
    }
    return {title: results[0].ticketName, description: results[0].ticketDescription};
}
