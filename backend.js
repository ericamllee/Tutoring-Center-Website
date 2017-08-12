// Erica Lee
// CS 290
// Final Project
// Node.js backend 

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 5152);
app.use(express.static('public'));
app.use(bodyParser.json());


//render the home page upon first arriving to the page.
app.get('/', function(req, res, next) {
    console.log("got a get request");
    res.render('home');
});


//handle the different types of post requests sent to the home page.
app.post('/',function(req,res,next){
    console.log('got a post')
    getTable(req.body.dbtype, res, next);
});


//This function sends the results of the full table to the client page.
function getTable(tableName, res, next) {
    console.log(tableName);
    mysql.pool.query('SELECT * FROM ??', [tableName], function(err, rows, fields){
    if(err){
         next(err);
         return;
    }
    results = JSON.stringify(rows);
    console.log(results);
    res.send(results);
    });
}

//
// //this function handles the SQL response for deleting or adding rows.
// function SQLResponse(err, results, next, res) {
//     if (err) {
//         next(err);
//         return;
//     }
//     getTable(res, next);
// }
//
// //This function handles deleting a row.
// function deleteRow(id, next, res) {
//     mysql.pool.query("DELETE FROM workout WHERE id = ?", [id], function(err, results) {
//         SQLResponse(err, results, next, res);
//     });
// }
//
//
// //https://stackoverflow.com/questions/21779528/insert-into-fails-with-node-mysql
// //used to figure out how to insert values stored in JSON into table.
// //This function handles adding a row.
// function addRow(json, next, res) {
//     mysql.pool.query("INSERT INTO workout SET ?", json, function(err, results) {
//         SQLResponse(err, results, next, res);
//     });
// }
//
//
// //This function renders the edit page upon receiving an edit request.
// app.get('/edit', function(req, res, next) {
//     context = {};
//     mysql.pool.query('SELECT * FROM workout WHERE id = ?', [req.query.id], function(err, rows, fields) {
//     if (err) {
//         console.log(err);
//         next(err);
//         return;
//     }
//     context = rows[0];
//     res.render('edit', context);
//     });
// });
//
//
// //This function handles the post request for the edit page.
// app.post('/edit', function(req, res, next) {
//     var id = req.body.hidden;
//     delete req.body.hidden;
//     mysql.pool.query("UPDATE workout SET ?  WHERE id=?", [req.body, id],
//     function(err, result) {
//         if(err){
//             next(err);
//         }
//         if (result.lbs == 1) {
//             result.lbs = true;
//         } else {
//             result.lbs = false;
//         }
//         res.send(result);
//   });
// });


app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
