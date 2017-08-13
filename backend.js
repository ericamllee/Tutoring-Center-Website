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
    if (req.body.makeTable) {
        getTable(req.body.dbtype, res, next);
    } else if (req.body.delete) {
        deleteRow(req.body, res, next);
    }

});

//This function renders the Student edit page upon receiving an edit request.
app.get('/studentsEdit', function(req, res, next) {
    context = {};
    mysql.pool.query('SELECT * FROM students WHERE id = ?', [req.query.id], function(err, rows, fields) {
    if (err) {
        console.log(err);
        next(err);
        return;
    }
    context = rows[0];
    res.render('studentsEdit', context);
    });
});

//This function handles the post request for the student edit page.
app.post('/studentsEdit', function(req, res, next) {
    console.log("in student edit");
    var id = req.body.hidden;
    delete req.body.hidden;
    console.log(req.body);
    console.log(id);
    mysql.pool.query("UPDATE students SET ?  WHERE id=?", [req.body, id],
    function(err, result) {
        if(err){
            next(err);
        }
        res.send(result);
  });
});

//This function renders the teachers edit page upon receiving an edit request.
app.get('/teachersEdit', function(req, res, next) {
    context = {};
    mysql.pool.query('SELECT * FROM teachers WHERE id = ?', [req.query.id], function(err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }
        context = rows[0];
        res.render('teachersEdit', context);
    });
});

//This function handles the post request for the edit page.
app.post('/teachersEdit', function(req, res, next) {
    console.log("in teachers edit");
    var id = req.body.hidden;
    delete req.body.hidden;
    console.log(req.body);
    console.log(id);
    mysql.pool.query("UPDATE teachers SET ?  WHERE id=?", [req.body, id],
        function(err, result) {
            if(err){
                next(err);
            }
            res.send(result);
        });
});

//This function renders the teachers edit page upon receiving an edit request.
app.get('/classesEdit', function(req, res, next) {
    context = {id : req.query.id};
    mysql.pool.query('SELECT * FROM classes WHERE id = ?', [req.query.id], function(err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        }
        context.row = rows[0];
        mysql.pool.query('SELECT * FROM teachers', function(err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                context.teacherList = rows;
                res.render('classesEdit', context);
            }
        });
    });
});

//This function handles the post request for the edit page.
app.post('/classesEdit', function(req, res, next) {
    console.log("in classes post");
    var id = req.body.hidden;
    delete req.body.hidden;
    console.log(req.body);
    console.log(id);
    mysql.pool.query("UPDATE classes SET ?  WHERE id=?", [req.body, id],
        function(err, result) {
            if(err){
                next(err);
            }
            res.send(result);
        });
});


//This function sends the results of the full table to the client page.
function getTable(tableName, res, next) {
    if (tableName === "classes") {
        mysql.pool.query('SELECT lname, c.id, type, day, time, capacity FROM classes c INNER JOIN teachers t ON t.id = c.tid', [tableName], function(err, rows, fields){
            if(err){
                next(err);
                return;
            }
            results = JSON.stringify(rows);
            console.log(results);
            res.send(results);
        });
    } else {
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
}

//
// //this function handles the SQL response for deleting or adding rows.
// function SQLResponse(err, results, next, res, name) {
//     if (err) {
//         next(err);
//         return;
//     }
//     getTable(name, res, next);
// }

//This function handles deleting a row.
function deleteRow(req, res, next) {
    console.log('in delete row');
    console.log(req);
    mysql.pool.query("DELETE FROM ?? WHERE id = ?", [req.dbtype, req.id], function(err, results) {
        if (err) {
            next(err);
            return;
        }
        getTable(req.dbtype, res, next);
    });
}



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
