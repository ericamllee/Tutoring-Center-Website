
// document.addEventListener('DOMContentLoaded', sendEdit);
// var headings = ["name", "reps", "weight", "date", "lbs"];
//
//
// /**This function handles the edit request. It sends the information to the backend if there are no errors.
//  *
//  */
// function sendEdit() {
//     document.getElementById("submitted").addEventListener('click', function(event) {
//         event.preventDefault();
//         var req = new XMLHttpRequest();
//         var payload;
//         var errors = errorHandler();
//         if (errors) {
//             return;
//         }
//
//         payload = getData();
//         req.open('POST', "/edit", true);
//         req.setRequestHeader('Content-Type', 'application/json');
//         responseListener(req);
//         req.send(payload);
//     });
// }
//
//
// /**
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
//
//
// /**
//  * This is the response listener. It listens for a response from the backend, and when it receives it, it calls makeTable.
//  *
//  * @param item
//  */
// function responseListener(item) {
//     item.addEventListener('load', function() {
//         if (item.status >= 200 && item.status < 400) {
//             console.log(JSON.parse(item.responseText));
//         } else {
//             console.log("error in network request: " + item.statusText);
//         }
//         window.location.href = "/";
//     });
// }
//
//
// /**
//  * This function takes in the form and transforms the input to a JSON string.
//  */
// function getData() {
//     var payload = {};
//     for (var i = 0; i < 4; i++) {
//         var thisValue = document.getElementById(headings[i]).value;
//         payload[headings[i]] = thisValue;
//     }
//
//     if (document.getElementById("true").checked) {
//         payload.lbs = 1;
//     } else {
//         payload.lbs = 0;
//     }
//     payload.hidden = document.getElementById("id").value;
//     return JSON.stringify(payload);
// }
