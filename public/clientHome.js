// Erica Lee
// CS 290
// Final Project
// Front-end page for the home page.

document.addEventListener('DOMContentLoaded', completePage);
var headings = {"classes":["teacher", "type", "day", "time", "capacity", "size"], "teachers": ["fname", "lname"], "students": ["fname", "lname", "grade"]}

/**
 * This function sends a request to the backend to get the information to make the table.
 */
function completePage() {
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    //responseListener(req);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({makeTable: "true"}));
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
//
//
// /***
//  * This function returns true if there is an error in the form submission. Otherwise, it returns false.
//  * @returns {boolean}
//  */
// function errorHandler() {
//     //There are errors if there is no name, or if the numerical values are negative.
//     if (document.getElementById("name").value === "" ||
//         document.getElementById("weight").value < 0 ||
//         document.getElementById("reps").value < 0) {
//         return true;
//     }
//     return false;
// }


// /**
//  * This is the response listener. It listens for a response from the backend, and when it receives it, it calls makeTable.
//  *
//  * @param item
//  */
// function responseListener(item) {
//     item.addEventListener('load', function() {
//         if (item.status >= 200 && item.status < 400) {
//             // var response = JSON.parse(item.responseText);
//             // makeTable(response.classes, "classes");
//             // makeTable(response.teachers, "teachers");
//             // makeTable(response.students, "students");
//             // makeTable(response.student_class, "sc");
//             console.log("got a response");
//         } else {
//             console.log("Error in network request: " + item.statusText);
//         };
//     });
// }


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


/***
 * This function makes a table after being sent the table information from the backend.
 * @param response
 */
// function makeTable(response, tableName) {
//     //delete the old table and header.
//     var oldTable = document.getElementsByClassName("table");
//     if (oldTable) {
//         oldTable.forEach(function(table) {
//             var parent = table.parentNode;
//             parent.removeChild(table);
//         })
//
//     }
//
//     //make the table
//     var table = document.createElement("table");
//     var parent = document.getElementById(tableName);
//     table.id = "table";
//     table.style.border = "1px solid";
//
//     //make the header row.
//     var headerRow = table.appendChild(document.createElement("tr"));
//     for (var i = 0; i < 4; i++) {
//         makeItem("th", headerRow, headings[tableName][i], headings[i]);
//     }
//
//     //make each row.
//     response.forEach(function(object) {
//         var newRow = document.createElement("tr");
//         headings[tableName].forEach( function(column) {
//             makeItem("td", newRow, object.id + object[column], object[column]);
//         })
//
//        // makeForm(lastCol, object.id);
//         table.appendChild(newRow);
//     });
//     parent.appendChild(table);
// }
//
//
// /**
//  * This function adds new items to the DOM. It takes in an element, gives it an id and adds any words to the item,
//  * then attaches it to the parent.
//  *
//  * @param type
//  * @param parent
//  * @param id
//  * @param words
//  * @returns {Element}
//  */
// function makeItem(type, parent,  id, words) {
//     var item = document.createElement(type);
//     if (id) {
//         item.id = id;
//     }
//     if (words) {
//         item.append(words);
//     }
//     item.style.border = "1px solid";
//     parent.appendChild(item);
//     return item;
// }


// /***
//  * This function makes a button with an event listener. It appends the button to the parent. Then it adds text
//  * and attaches the id and a function to the new button.
//  *
//  * @param text
//  * @param funcName
//  * @param parent
//  * @param id
//  * @returns {Element}
//  */
// function makeButton(text, funcName, parent, id) {
//     var button = document.createElement("BUTTON");
//     var t = document.createTextNode(text);
//     button.append(t);
//     button.id = text;
//     parent.appendChild(button);
//     button.hiddenId = id;                           //is this necessary? or is makeHidden where the hidden id comes from?
//     button.addEventListener("click", funcName);
//     return button;
// }
//

// /**
//  * This function adds the id to the form.
//  * @param parent
//  * @param id
//  */
// function makeHidden(parent, id) {
//     var hidden = document.createElement("input");
//     hidden.type = "hidden";
//     hidden.value = id;
//     parent.appendChild(hidden);
// }
//
//
// /***
//  * This function is used to make the form containing the edit and delete buttons. It makes the buttons,
//  * then appends the id as hidden input to the form.
//  * @param parent
//  * @param id
//  */
// function makeForm(parent, id) {
//     var form = document.createElement("FORM");
//     makeButton("Edit", editRow, form, id);
//     makeButton("Delete", deleteRow, form, id);
//     makeHidden(form, id);
//     parent.appendChild(form);
// }
//
//
// /******
//  * The function is called when the delete button is hit. It sends a post request to the home page,
//  * indicating that a delete button has been hit, along with the id of the row.
//  *
//  * @param event
//  */
// function deleteRow(event) {
//     event.preventDefault();
//     var req = new XMLHttpRequest();
//     req.open('POST', "/", true);
//     req.setRequestHeader('Content-Type', 'application/json');
//     var payload = {id: event.target.hiddenId, delete: "true"};
//     responseListener(req);
//     req.send(JSON.stringify(payload));
// }
//
//
// /***
//  * This function is called when the edit button has been hit. It reroutes the website to the edit home page,
//  * also sending the id of the element in the URL.
//  * @param event
//  */
// function editRow(event) {
//     event.preventDefault();
//     window.location.href = "/edit?id=" + event.target.hiddenId;
// }
