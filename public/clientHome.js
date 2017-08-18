// Erica Lee
// CS 290
// Final Project
// Front-end page for the home page.
var headings = {students: ["fname", "lname", "grade"], teachers : ["fname", "lname"], classes: ["teacher", "type", "day", "time", "classroom", "capacity", "size"], classrooms: ["name", "capacity"]};

function sendPost(event) {
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    var dbtype = document.querySelector('input[name = "db"]:checked').value;
    tableResponse(req, dbtype, true);
    var toSend = {makeTable: "true", dbtype: dbtype};
    req.send(JSON.stringify(toSend));
}

function tableResponse(req, dbtype, bool) {
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            removeOld("filterForm");
            removeOld("table");
            removeOld("Add");
            makeTable(dbtype, response);
            makeButton("Add", addRow, document.body, "addButton", dbtype);
            if (bool) {
                makeFilterForm(dbtype);
            }
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
}

document.getElementById("submitted").addEventListener('click', sendPost);



function makeTable(tableName, response) {
    //make the table
    console.log(response);
    var table = document.createElement("table");
    table.id = "table";
    table.style.border = "1px solid";

    //make the header row.
    var headerRow = table.appendChild(document.createElement("tr"));
    var currentHeadings = headings[tableName];
    for (var i = 0; i < currentHeadings.length; i++) {
        makeItem("th", headerRow, currentHeadings[i], currentHeadings[i]);
    }
    makeItem("th", headerRow, "change", "edit row");

    //make each row.
    response.forEach(function(object) {
        var newRow = document.createElement("tr");
        newRow.id = "class" + object.id;
        currentHeadings.forEach( function(column) {
            makeItem("td", newRow, object.id + object[column], object[column]);
        });

        var lastCol =  makeItem("td", newRow);
        makeForm(lastCol, object.id, tableName);
        if (tableName == "classes") {
            makeButton("Show Students", showStudents, lastCol, object.id);
            if (object.size < object.capacity) {
                makeButton("Add Student", addStudent, lastCol, object.id);
            }

        } else if (tableName == "students") {
            makeButton("Show Classes", showClasses, lastCol, object.id);
            makeButton("Add Class", addClasses, lastCol, object.id);
        } else {
            makeButton("Show Classes", showSchedule, lastCol, object.id);
        }
        table.appendChild(newRow);
    });
    document.body.appendChild(table);
}


/**
 * This function adds new items to the DOM. It takes in an element, gives it an id and adds any words to the item,
 * then attaches it to the parent.
 *
 * @param type
 * @param parent
 * @param id
 * @param words
 * @returns {Element}
 */
function makeItem(type, parent,  id, words, value) {
    var item = document.createElement(type);
    if (id) {
        item.id = id;
    }
    if (words) {
        item.append(words);
    }
    if (value) {
        item.value = value;
    }

    item.style.border = "1px solid";
    parent.appendChild(item);
    return item;
}


/***
 * This function makes a button with an event listener. It appends the button to the parent. Then it adds text
 * and attaches the id and a function to the new button.
 *
 * @param text
 * @param funcName
 * @param parent
 * @param id
 * @returns {Element}
 */
function makeButton(text, funcName, parent, id, dbname) {
    var button = document.createElement("BUTTON");
    var t = document.createTextNode(text);
    button.append(t);
    button.id = text;
    parent.appendChild(button);
    button.hiddenId = id;
    button.name = dbname;
    button.addEventListener("click", funcName);
    return button;
}


/***
 * This function is used to make the form containing the edit and delete buttons. It makes the buttons,
 * then appends the id as hidden input to the form.
 * @param parent
 * @param id
 */
function makeForm(parent, id, dbname) {
    var form = document.createElement("FORM");
    makeButton("Edit", editRow, form, id, dbname);
    makeButton("Delete", deleteRow, form, id, dbname);
    parent.appendChild(form);
}


/******
 * The function is called when the delete button is hit. It sends a post request to the home page,
 * indicating that a delete button has been hit, along with the id of the row.
 *
 * @param event
 */
function deleteRow(event) {
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open('POST', "/", true);
    req.setRequestHeader('Content-Type', 'application/json');
    var name = event.target.name;
    var payload = {id: event.target.hiddenId, delete: "true", dbtype: name};
    req.addEventListener('load', sendPost);
    req.send(JSON.stringify(payload));
}


/***
 * This function is called when the edit button has been hit. It reroutes the website to the edit home page,
 * also sending the id of the element in the URL.
 * @param event
 */
function editRow(event) {
    event.preventDefault();
    var dbname = event.target.name;
    window.location.href = "/" + dbname + "?id=" + event.target.hiddenId;
}

function addRow(event) {
    event.preventDefault();
    var dbname = event.target.name;
    window.location.href = "/" + dbname;
}

function showStudents(event) {
    var id = event.target.hiddenId;
    var current = document.getElementById("students" + id);
    if (current) {
        removeOld("students" + event.target.hiddenId);
    } else {
        event.preventDefault();
        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                console.log(response);
                var newCol = makeItem("td", document.getElementById("class" + id), "students" + id);
                response.forEach(function (item) {
                    var text = item.fname + " " + item.lname;
                    p = makeItem("p", newCol, item.id.toString() + id.toString(), text);
                    makeRemove("Remove student", p, item.id, id);
                });
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        var toSend = {showStudents: "true", id: id};
        console.log(toSend);
        req.send(JSON.stringify(toSend));
    }
}


function showClasses(event) {
    var id = event.target.hiddenId;
    var current = document.getElementById("classes" + id);
    if (current) {
        removeOld("classes" + event.target.hiddenId);
    } else {
        event.preventDefault();
        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                var newCol = makeItem("td", document.getElementById("class" + id), "classes" + id);
                response.forEach(function (item) {
                    var p = makeItem("p", newCol, id.toString() + item.id.toString(), classToString(item));
                    makeRemove("Remove class", p, id, item.id);
                });
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        var toSend = {showClasses: "true", id: id};
        req.send(JSON.stringify(toSend));
    }
}

function showSchedule(event) {
    var type = document.querySelector('input[name = "db"]:checked').value;
    var id = event.target.hiddenId;
    var current = document.getElementById("sched" + id);
    if (current) {
        removeOld("sched" + id);
    } else {
        event.preventDefault();
        var id = event.target.hiddenId;
        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                var response = JSON.parse(req.responseText);
                console.log(response);
                var newCol = makeItem("td", document.getElementById("class" + id), "sched" + id);
                response.forEach(function (item) {
                    var p = makeItem("p", newCol, id.toString() + item.id.toString(), classToString(item));
                });
            } else {
                console.log("Error in network request: " + req.statusText);
            }
        });
        var toSend = {showSchedule: "true", id: id, type: type};
        req.send(JSON.stringify(toSend));
    }
}

function makeRemove(text, parent, sid, cid) {
    var button = document.createElement("BUTTON");
    var t = document.createTextNode(text);
    button.append(t);
    parent.appendChild(button);
    button.addEventListener("click", function(event) {
        var req = new XMLHttpRequest();
        req.open('POST', '/', true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', sendPost);
        var toSend = {removeItem: "true", sid: sid, cid:cid};
        console.log(toSend);
        req.send(JSON.stringify(toSend));
    });
    return button;
}

function classToString(item) {
    return item.type + " class with " + item.fname + " " + item.lname + " on " + item.day + " at " + item.time;
}



function addStudent(event) {
    var current = document.getElementById("adding");
    if (current) {
        var parent = current.parentNode;
        parent.removeChild(current);
    }

    console.log("in add students");
    event.preventDefault();
    var id = event.target.hiddenId;
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            console.log(response);
            var addCol = makeItem("td", document.getElementById("class" + id), "adding");
            var addStudent = makeItem("FORM", document.getElementById("adding"), "addStudent" + id);

            var select = makeItem("Select", addStudent, "findStudent");
            response.forEach(function(student) {
                makeItem("option", select, student.id, student.NAME, student.id);
            });

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.id = "submitted";

            addCol.appendChild(submit);
            submit.addEventListener("click", function(event) {
               var req2 = new XMLHttpRequest();
               req2.open('Post', '/', true);
               req2.setRequestHeader('Content-Type', 'application/json');
               req2.addEventListener('load', sendPost);
               var sidElem = document.getElementById("findStudent");
               var sid = sidElem.options[sidElem.selectedIndex].value;

               var sendClass = {addStudentClass : true, cid: id, sid: sid};
               req2.send(JSON.stringify(sendClass));
            });

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    var toSend = {addStudent: "true", id: id};
    console.log(toSend);
    req.send(JSON.stringify(toSend));
}


function addClasses(event) {
    removeOld("adding");
    event.preventDefault();
    var id = event.target.hiddenId;
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            var response = JSON.parse(req.responseText);
            console.log(response);

            if (response.length === 0) {
                console.log("no classes to add");
                return;
            }

            var addCol = makeItem("td", document.getElementById("class" + id), "adding");
            var addClass = makeItem("FORM", document.getElementById("adding"), "addClass" + id);
            var select = makeItem("Select", addClass, "findClass");
            response.forEach(function(item) {
                var last = makeItem("option", select, item.id, classToString(item), item.id);
            });

            var submit = document.createElement("input");
            submit.type = "submit";
            submit.id = "submitted";

            addCol.appendChild(submit);
            submit.addEventListener("click", function(event) {
                var req2 = new XMLHttpRequest();
                req2.open('Post', '/', true);
                req2.setRequestHeader('Content-Type', 'application/json');
                req2.addEventListener('load', sendPost);
                var cidElem = document.getElementById("findClass");
                var cid = cidElem.options[cidElem.selectedIndex].value;

                var sendClass = {addStudentClass : true, cid: cid, sid: id};
                req2.send(JSON.stringify(sendClass));
            });

        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    var toSend = {addClasses: "true", id: id};
    console.log(toSend);
    req.send(JSON.stringify(toSend));
}

function removeOld(itemID) {
    var item = document.getElementById(itemID);
    if (item) {
        var parent = item.parentNode;
        parent.removeChild(item);
    }
}

function makeFilterForm(type) {
    removeOld("filterForm");

    var form = document.createElement("FORM");
    form.method = "post";
    form.id = "filterForm";

    var title = document.createElement("h2");
    title.textContent = "\nFilter By:\n";
    form.appendChild(title);

    makeTextBoxes(headings[type], form);
    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.id = "submitted";
    submitButton.addEventListener('click', sendFilter);
    form.appendChild(submitButton);
    document.body.appendChild(form);
}


function makeTextBoxes(textArray, parent) {
    textArray.forEach(function(text) {
        var p = document.createElement("p");
        // var label, textbox;
        // label = document.createElement('label');
        p.appendChild(document.createTextNode(text + ": "));
        var textbox = document.createElement('input');
        textbox.id = "filter" + text;
        textbox.type = 'text';
        p.appendChild(textbox);
        parent.appendChild(p);
    });
}

function sendFilter(event) {
    event.preventDefault();
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    var dbtype = document.querySelector('input[name = "db"]:checked').value;
    // req.addEventListener('load', tableResponse);
    tableResponse(req, dbtype, false);
    var toSend = {filter: "true", dbtype: dbtype};
    headings[dbtype].forEach(function(heading) {
        toSend[heading] = document.getElementById("filter" + heading).value;
    });
    console.log(toSend);
    req.send(JSON.stringify(toSend));
}