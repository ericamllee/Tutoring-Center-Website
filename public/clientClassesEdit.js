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
        var tid = document.getElementById("tid");
        var teacherID = tid.options[tid.selectedIndex].value;

        var day = document.getElementById("day");
        var dayName = day.options[day.selectedIndex].value;

        var time = document.getElementById("time");
        var timeSet = time.options[time.selectedIndex].value;

        var type = document.getElementById("type");
        var classtype = type.options[type.selectedIndex].value;

        var capacity = document.getElementById("capacity").value;

        if (capacity < 0) {
            return;
        }

        payload = {hidden : document.getElementById("id").value,
            tid : teacherID,
            day : dayName,
            time : timeSet,
            type : classtype,
            capacity : capacity || 0
        }

        req.open('POST', "/classesEdit", true);
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