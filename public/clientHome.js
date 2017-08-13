// Erica Lee
// CS 290
// Final Project
// Front-end page for the home page.
var headings = {students: ["fname", "lname", "grade"], teachers : ["fname", "lname"], classes: ["lname", "type", "day", "time", "capacity"]};

function sendPost(event) {
    event.preventDefault();
    console.log("in send post");
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.setRequestHeader('Content-Type', 'application/json');
    var dbtype = document.querySelector('input[name = "db"]:checked').value;
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            console.log("got a response");
            var response = JSON.parse(req.responseText);
            makeTable(dbtype, response);
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    console.log(dbtype);
    var toSend = {makeTable: "true", dbtype: dbtype};
    req.send(JSON.stringify(toSend));
}


document.getElementById("submitted").addEventListener('click', sendPost);



function makeTable(tableName, response) {
    console.log("in makeTable");
    var oldTable = document.getElementById("table");
    if (oldTable) {
        var parent = oldTable.parentNode;
        parent.removeChild(oldTable);
    }

    //make the table
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
        console.log(object);
        var newRow = document.createElement("tr");
        currentHeadings.forEach( function(column) {
            makeItem("td", newRow, object.id + object[column], object[column]);
        })

        var lastCol =  makeItem("td", newRow);
        makeForm(lastCol, object.id, tableName);
        table.appendChild(newRow);
    });
    document.body.appendChild(table);
}

// /**
//  * This function handles adding an item to the database. It sends the backend the form information once it's submitted.
//  *
//  */
// function addItem(){
//     document.getElementById("submitted").addEventListener('click', function(event){
//     event.preventDefault();
//         var req = new XMLHttpRequest();
//         //check for errors. If there are errors, return without sending information to the backend.
//         if (errorHandler()) {
//                return;
//         }
//         req.open('POST', "/", true);
//         responseListener(req);
//         req.setRequestHeader('Content-Type', 'application/json');
//         req.send(formToJSONString());
//    })}



// /**
//  * This function takes in the form and transforms the input to a JSON string.
//  */
// function formToJSONString(){
//     var payload = {};
//     for (var i = 0; i < 4; i++) {
//         var thisValue = document.getElementById(headings[i]).value;
//         payload[headings[i]] = thisValue;
//      }
//        if (document.getElementById("true").checked) {
//            payload.lbs = 1;
//        } else {
//            payload.lbs = 0;
//        }
//     return JSON.stringify(payload);
// }


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
function makeItem(type, parent,  id, words) {
    var item = document.createElement(type);
    if (id) {
        item.id = id;
    }
    if (words) {
        item.append(words);
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
    button.hiddenId = id;                           //is this necessary? or is makeHidden where the hidden id comes from?
    button.name = dbname;
    button.addEventListener("click", funcName);
    return button;
}


// /**
//  * This function adds the id to the form.
//  * @param parent
//  * @param id
//  */
// function makeHidden(parent, id, dbtype) {
//     var hidden = document.createElement("input");
//     hidden.type = "hidden";
//     hidden.value = id;
//     hidden.name = dbtype;
//     parent.appendChild(hidden);
// }


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
    // makeHidden(form, id, dbname);
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
    console.log("in deleteRow");
    var req = new XMLHttpRequest();
    req.open('POST', "/", true);
    req.setRequestHeader('Content-Type', 'application/json');
    var name = event.target.name;
    var payload = {id: event.target.hiddenId, delete: "true", dbtype: name};
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            console.log("got a response");
            var response = JSON.parse(req.responseText);
            makeTable(name, response);
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(payload));
}


/***
 * This function is called when the edit button has been hit. It reroutes the website to the edit home page,
 * also sending the id of the element in the URL.
 * @param event
 */
function editRow(event) {
    event.preventDefault();
    console.log(event.target);
    var dbname = event.target.name;
    console.log("in edit row" + dbname);
    window.location.href = "/" + dbname + "Edit?id=" + event.target.hiddenId;
}
