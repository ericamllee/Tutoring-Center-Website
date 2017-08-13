/**
 * Created by ericalee on 8/12/17.
 */

/**
 * Created by ericalee on 8/12/17.
 */

document.addEventListener('DOMContentLoaded', sendEdit);


/**This function handles the edit request. It sends the information to the backend if there are no errors.
 *
 */
function sendEdit() {
    document.getElementById("submitted").addEventListener('click', function(event) {
        event.preventDefault();
        var req = new XMLHttpRequest();
        var payload;
        var errors = errorHandler();
        if (errors) {
            return;
        }

        payload = {hidden : document.getElementById("id").value,
            fname : document.getElementById("fname").value,
            lname : document.getElementById("lname").value};
        req.open('POST', "/teachersEdit", true);
        req.setRequestHeader('Content-Type', 'application/json');
        responseListener(req);
        req.send(JSON.stringify(payload));
    });
}


/**
 * This function returns true if there is an error in the form submission. Otherwise, it returns false.
 * @returns {boolean}
 */
function errorHandler() {
    //There are errors if there is no name, or if the numerical values are negative.
    if (document.getElementById("fname").value === "") {
        return true;
    }
    return false;
}


/**
 * This is the response listener. It listens for a response from the backend, and when it receives it, it calls makeTable.
 *
 * @param item
 */
function responseListener(item) {
    item.addEventListener('load', function() {
        if (item.status >= 200 && item.status < 400) {
            console.log(JSON.parse(item.responseText));
        } else {
            console.log("error in network request: " + item.statusText);
        }
        window.location.href = "/";
    });
}