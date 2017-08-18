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
app.set('port', 4000);
app.use(express.static('public'));
app.use(bodyParser.json());

var numAttributes = {capacity : true, size : true, grade : true};


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
    } else if (req.body.filter) {
        var type = req.body.dbtype;
        delete req.body.dbtype;
        delete req.body.filter;
        if (type === "classes") {
            filter("SELECT * FROM (SELECT CONCAT(fname, ' ', lname) as teacher, c.id, type, day, time, capacity, cr.name as classroom, COUNT(sid) as size FROM `classes` c " +
            'INNER JOIN teachers t ON t.id = c.tid ' +
            'INNER JOIN classrooms cr ON c.classid = cr.id ' +
            'LEFT JOIN student_class sc ON c.id = sc.cid ' +
            'GROUP BY c.id ORDER BY day, time) as t1', req.body, res, next);
        } else {
            filter("SELECT * FROM " + type, req.body, res, next);
        }
    } else if (req.body.showStudents) {
        mysql.pool.query('SELECT fname, lname, s.id from students s ' +
            'INNER JOIN student_class sc ON s.id = sc.sid ' +
            'INNER JOIN classes c ON c.id = sc.cid WHERE sc.cid = ?', [req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            } else {
                var context = rows;
                res.send(context);
            }
        });
    } else if (req.body.addStudent) {
        mysql.pool.query('select id, CONCAT(fname, " ", lname) as NAME FROM students where id NOT IN ' +
            '(select s.id from students s ' +
            'INNER JOIN student_class sc ON sc.sid = s.id ' +
            'INNER JOIN classes c ON c.id = sc.cid ' +
            'WHERE day = (SELECT day from classes where id = ?) ' +
            'AND time = (SELECT time FROM classes where id = ?))',
            [req.body.id, req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            } else {
                var context = rows;
                res.send(context);
            }
        });
    } else if (req.body.addStudentClass) {
        delete req.body.addStudentClass;
        mysql.pool.query("INSERT INTO student_class SET ?", [req.body],
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                }
                res.send(result);
            });
    } else if (req.body.showClasses) {
        mysql.pool.query('SELECT t.fname, t.lname, type, day, time, c.id from students s ' +
            'INNER JOIN student_class sc ON s.id = sc.sid ' +
            'INNER JOIN classes c ON c.id =sc.cid ' +
            'INNER JOIN teachers t ON t.id = c.tid WHERE s.id = ?',
            [req.body.id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            } else {
                var context = rows;
                res.send(context);
            }
        });
    } else if (req.body.showSchedule) {
        var query = 'SELECT t.fname, t.lname, type, day, time, c.id from classes c ' +
            'INNER JOIN teachers t ON t.id = c.tid WHERE ';
        if (req.body.type == "teachers") {
            query += "tid = ?";
        } else {
            query += "classid = ?";
        }
        console.log(query);
        mysql.pool.query(query,
            [req.body.id], function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                } else {
                    console.log(rows);
                    res.send(rows);
                }
            });
    } if (req.body.addClasses) {
        mysql.pool.query('SELECT t3.fname, t3.lname, t3.type, t3.day, t3.time, t3.id FROM ' +
            '(SELECT * FROM ' +
            '(SELECT COUNT(sid) as size, cr.capacity, c.day, c.time, c.type, t.fname, t.lname, c.id FROM classes c ' +
            'INNER JOIN teachers t ON t.id = c.tid INNER JOIN classrooms cr ON c.classid = cr.id ' +
            'LEFT JOIN student_class sc ON sc.cid = c.id GROUP BY c.id)  as t1 ' +
            'WHERE t1.id NOT IN ' +
            '(SELECT cl.id from classes cl ' +
            'INNER JOIN student_class sc ON cl.id = sc.cid ' +
            'INNER JOIN students s ON sc.sid = s.id WHERE s.id = ?) AND size < capacity) as t3 ' +
            'LEFT JOIN ' +
            '(SELECT c.id, c.day, c.time FROM classes c ' +
            'INNER JOIN student_class sc ON sc.cid = c.id WHERE sc.sid = ?) as t4 ' +
            'ON t3.day = t4.day AND t3.time = t4.time WHERE t4.id IS NULL;',
            [req.body.id, req.body.id], function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                } else {
                    var context = rows;
                    res.send(context);
                }
            });
    } else if (req.body.removeItem) {
        mysql.pool.query('DELETE from student_class WHERE sid = ? AND cid = ?', [req.body.sid, req.body.cid], function(err, results) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            }
            res.send(results);
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
                res.send(JSON.stringify(err));
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
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            }
            res.send(result);
         });
    } else {
        mysql.pool.query("INSERT INTO students SET ?", [req.body],
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
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
                res.send(JSON.stringify(err));
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
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                }
                res.send(result);
            });
    } else {
        mysql.pool.query("INSERT INTO teachers SET ?", [req.body],
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                }
                res.send(result);
            });
    }
});



app.get('/classrooms', function(req, res, next) {
    var context = {type : "Add"};
    var id = req.query.id;
    if (id) {
        mysql.pool.query('SELECT * FROM classrooms WHERE id = ?', [id], function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            } else {
                context.row = rows[0];
                context.type = "Edit";
                res.render('classrooms', context);
            }
        });
    } else {
        res.render('classrooms', context);
    }
});

//This function handles the post request for the student edit page.
app.post('/classrooms', function(req, res, next) {
    var id = req.body.hidden;
    if (id) {
        delete req.body.hidden;
        mysql.pool.query("UPDATE classrooms SET ?  WHERE id = ?", [req.body, id],
            function(err, result) {
                if(err){
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                }
                res.send(result);
            });
    } else {
        mysql.pool.query("INSERT INTO classrooms SET ?", [req.body],
            function (err, result) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
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
            res.send(JSON.stringify(err));
            next(err);
            return;
        } else {
            context.teacherList = rows;
            mysql.pool.query('SELECT * FROM classrooms', function(err, rows, fields) {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(err));
                    next(err);
                    return;
                } else {
                    context.classlist = rows;
                    if (id) {
                        mysql.pool.query('SELECT * FROM classes WHERE id = ?', [id], function (err, rows, fields) {
                            if (err) {
                                console.log(err);
                                res.send(JSON.stringify(err));
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
                    if (err.code == 'ER_DUP_ENTRY') {
                        res.send({error: "The classroom is in use or the teacher is busy at that time."})
                    } else {
                        console.log(err);
                        res.send(JSON.stringify(err));
                        next(err);
                        return;
                    }

                }
                res.send(result);
            });
    } else {
        mysql.pool.query("INSERT INTO classes SET ?", [req.body],
            function (err, result) {

                if (err) {
                    if (err.code == 'ER_DUP_ENTRY') {
                        res.send({error: "The classroom is in use or the teacher is busy at that time."});
                    } else {
                        console.log(err);
                        res.send(JSON.stringify(err));
                        next(err);
                        return;
                    }
                }
                res.send(result);
            });
    }
});


//This function sends the results of the full table to the client page.
function getTable(tableName, res, next) {
    if (tableName === "classes") {
        mysql.pool.query('SELECT CONCAT(fname, " ", lname) as teacher, c.id, type, day, time, capacity, cr.name as classroom, COUNT(sid) as size FROM `classes` c ' +
            'INNER JOIN teachers t ON t.id = c.tid ' +
            'INNER JOIN classrooms cr ON c.classid = cr.id ' +
            'LEFT JOIN student_class sc ON c.id = sc.cid ' +
            'GROUP BY c.id ORDER BY day, time',
            [tableName], function(err, rows, fields){
            if(err){
                console.log(err);
                res.send(JSON.stringify(err));
                next(err);
                return;
            }
            results = JSON.stringify(rows);
            res.send(results);
        });
    } else {
        mysql.pool.query('SELECT * FROM ??', [tableName], function(err, rows, fields){
        if(err){
            console.log(err);
            res.send(JSON.stringify(err));
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
    mysql.pool.query("DELETE FROM ?? WHERE id = ?", [req.dbtype, req.id], function(err, results) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify(err));
            next(err);
            return;
        }
        getTable(req.dbtype, res, next);
    });
}


function filter(baseQuery, list, res, next) {
    var searchItems = [];
    var text = Object.keys(list).filter(function(key) {
        return list[key] !== "";
    }).map(function(goodKey) {
        var itemText = goodKey + ((goodKey in numAttributes) ? " = ? " : " LIKE ?");
        if (!(goodKey in numAttributes)) {
            list[goodKey] = "%" + list[goodKey] + "%";
        }
        searchItems.push(list[goodKey]);
        return itemText;
    }).join(" AND ");

    if (text !== "") {
        text = " WHERE " + text;
    }

    var query = baseQuery + text;

    mysql.pool.query(query, searchItems, function(err, results) {
        if (err) {
            console.log(err);
            res.send(JSON.stringify(err));
            next(err);
            return;
        }
        res.send(results);
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
