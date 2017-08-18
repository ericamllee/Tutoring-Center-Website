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
        removeOld("error message");
        var req = new XMLHttpRequest();
        var payload;
        if (document.getElementById("lname").value === "" || document.getElementById("fname").value === "") {
            var p = document.createElement("p");
            p.id = "error message";
            p.textContent = "Please fill out all fields";
            var form = document.getElementById("form");
            form.appendChild(p);
            return;
        }

        payload = {
            fname : document.getElementById("fname").value,
            lname : document.getElementById("lname").value};

        var id = document.getElementById("id");
        if (id) {
            payload.hidden = id.value;
        }
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
            window.location.href = "/";
        } else {
            console.log("error in network request: " + item.statusText);
        }

    });
}


function removeOld(itemID) {
    var item = document.getElementById(itemID);
    if (item) {
        var parent = item.parentNode;
        parent.removeChild(item);
    }
}