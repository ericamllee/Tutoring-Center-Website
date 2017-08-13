/**
 * Created by ericalee on 8/12/17.
 */
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
        if (document.getElementById("lname").value === "") {
            return;
        }

        payload = {
            fname : document.getElementById("fname").value,
            lname : document.getElementById("lname").value};
        req.open('POST', "/teachers", true);
        req.setRequestHeader('Content-Type', 'application/json');
        responseListener(req);
        req.send(JSON.stringify(payload));
    });
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