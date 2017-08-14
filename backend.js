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
app.set('port', 3000);
app.use(express.static('public'));
app.use(bodyParser.json());


//render the home page upon first arriving to the page.
app.get('/', function(req, res, next) {
    res.render('home');
});


//handle the different types of post requests sent to the home page.
app.post('/',function(req,res,next){
    if (req.body.makeTable) {
        getTable(req.body.dbtype, res, next);
    } else if (req.body.delete) {
        deleteRow(req.body, res, next);
    } else if (req.body.showStudents) {
        console.log("in show students backend");
        mysql.pool.query('SELECT fname, lname from students s INNER JOIN student_class sc ON s.id = sc.sid INNER JOIN classes c ON c.id =sc.cid WHERE c.id = ?', [req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                var context = rows;
                console.log(context);
                res.send(context);
            }
        });
    } else if (req.body.addStudent) {
        mysql.pool.query('select id, CONCAT(fname, " ", lname) as NAME from (select t1.id as id, t1.fname as fname, t1.lname as lname, t2.id as otherID from students t1 LEFT JOIN ' +
            '(SELECT s.id FROM students s INNER JOIN student_class sc ON s.id = sc.sid INNER JOIN classes c ON c.id = sc.cid WHERE c.id = ?) as t2 ON t1.id = t2.id) as t3 WHERE otherID IS NULL',
            [req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                var context = rows;
                console.log(context);
                res.send(context);
            }
        });
    } else if (req.body.addStudentClass) {
        delete req.body.addStudentClass;
        mysql.pool.query("INSERT INTO student_class SET ?", [req.body],
            function (err, result) {
                if (err) {
                    next(err);
                }
                res.send(result);
            });
    } else if (req.body.showClasses) {
        console.log("in show class backend");
        mysql.pool.query('SELECT CONCAT(t.fname, " ", t.lname) as teacher, type, day, time from students s INNER JOIN student_class sc ON s.id = sc.sid INNER JOIN classes c ON c.id =sc.cid INNER JOIN teachers t ON t.id = c.tid WHERE s.id = ?',
            [req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                var context = rows;
                console.log(context);
                res.send(context);
            }
        });
    } else if (req.body.addClasses) {
        mysql.pool.query('select id, fname, lname, type, day, time from (select t1.id as id, t1.fname, t1.lname, t1.type, t1.day, t1.time, t2.id as otherID from (' +
            'select cl.id, t.fname, t.lname, cl.type, cl.day, cl.time from classes cl ' +
            'INNER JOIN teachers t ON cl.tid = t.id) as t1 ' +
            'LEFT JOIN (' +
            'SELECT c.id FROM `classes` c' +
            ' INNER JOIN student_class sc ON sc.cid = c.id WHERE sc.sid = ?) as t2 ON t1.id = t2.id) as t3 WHERE otherID IS NULL',
            [req.body.id], function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    next(err);
                    return;
                } else {
                    var context = rows;
                    console.log(context);
                    res.send(context);
                }
            });
    }
});


app.get('/students', function(req, res, next) {
    var context = {type : "Add"};
    var id = req.query.id;
    if (id) {
        mysql.pool.query('SELECT * FROM students WHERE id = ?', [req.query.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                context.row = rows[0];
                context.type = "Edit";
                res.render('students', context);
            }
        });
    } else {
        res.render('students', context);
    }
});

//This function handles the post request for the student edit page.
app.post('/students', function(req, res, next) {
    if (req.body.hidden) {
        var id = req.body.hidden;
        delete req.body.hidden;
        mysql.pool.query("UPDATE students SET ?  WHERE id=?", [req.body, id],
        function(err, result) {
            if(err){
                next(err);
            }
            res.send(result);
         });
    } else {
        mysql.pool.query("INSERT INTO students SET ?", [req.body],
            function (err, result) {
                if (err) {
                    next(err);
                }
                res.send(result);
            });
    }
});


app.get('/teachers', function(req, res, next) {
    var context = {type : "Add"};
    var id = req.query.id;
    if (id) {
        mysql.pool.query('SELECT * FROM teachers WHERE id = ?', [id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                next(err);
                return;
            } else {
                context.row = rows[0];
                context.type = "Edit";
                res.render('teachers', context);
            }
        });
    } else {
        res.render('teachers', context);
    }
});

//This function handles the post request for the student edit page.
app.post('/teachers', function(req, res, next) {
    var id = req.body.hidden;
    if (id) {
        delete req.body.hidden;
        mysql.pool.query("UPDATE teachers SET ?  WHERE id=?", [req.body, id],
            function(err, result) {
                if(err){
                    next(err);
                }
                res.send(result);
            });
    } else {
        mysql.pool.query("INSERT INTO teachers SET ?", [req.body],
            function (err, result) {
                if (err) {
                    next(err);
                }
                res.send(result);
            });
    }
});



//This function renders the teachers edit page upon receiving an edit request.
app.get('/classes', function(req, res, next) {
    var context = {type : "Add"};
    var id = req.query.id;
    mysql.pool.query('SELECT * FROM teachers', function(err, rows, fields) {
        if (err) {
            console.log(err);
            next(err);
            return;
        } else {
            context.teacherList = rows;
            if (id) {
                mysql.pool.query('SELECT * FROM classes WHERE id = ?', [id], function(err, rows, fields) {
                    if (err) {
                        console.log(err);
                        next(err);
                        return;
                    }
                    context.row = rows[0];
                    context.type = "Edit";
                    res.render('classes', context);
                    });
            } else {
                res.render('classes', context);
            }
        }
    });
});


//This function handles the post request for the edit page.
app.post('/classes', function(req, res, next) {
    var id = req.body.hidden;
    if (id) {
        delete req.body.hidden;
        mysql.pool.query("UPDATE classes SET ?  WHERE id=?", [req.body, id],
            function (err, result) {
                if (err) {
                    next(err);
                }
                res.send(result);
            });
    } else {
        mysql.pool.query("INSERT INTO classes SET ?", [req.body],
            function (err, result) {
                if (err) {
                    next(err);
                }
                res.send(result);
            });
    }
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
            res.send(results);
        });
    } else {
        mysql.pool.query('SELECT * FROM ??', [tableName], function(err, rows, fields){
        if(err){
             next(err);
             return;
        }
        results = JSON.stringify(rows);
        res.send(results);
        });
    }
}


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
