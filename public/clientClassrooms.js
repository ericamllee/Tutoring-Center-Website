/**
 * Created by ericalee on 8/14/17.
 */


document.addEventListener('DOMContentLoaded', sendEdit);


/**This function handles the edit request. It sends the information to the backend if there are no errors.
 *
 */
function sendEdit() {
    document.getElementById("submitted").addEventListener('click', function(event) {
        event.preventDefault();
        removeOld("error message");
        var req = new XMLHttpRequest();
        var payload;
        if (document.getElementById("classname").value === "" || document.getElementById("capacity").value <= 0) {
            var p = document.createElement("p");
            p.id = "error message";
            p.textContent = "Please fill out all fields. Capacity must be greater than 0.";
            var form = document.getElementById("form");
            form.appendChild(p);
            return;
        }
        payload = {
            capacity : document.getElementById("capacity").value,
            name : document.getElementById("classname").value};

        var id = document.getElementById("id");
        if (id) {
            payload.hidden = id.value;
        }
        req.open('POST', "/classrooms", true);
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

function removeOld(itemID) {
    var item = document.getElementById(itemID);
    if (item) {
        var parent = item.parentNode;
        parent.removeChild(item);
    }
}