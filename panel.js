var token = "";
var tuid = "";
var ebs = "";

// because who wants to type this every time?
var twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
var requests = {
    set: postRequest('POST', 'amount'),
    get: getRequest('GET', 'query')
};

function postRequest(type, method) {
    return {
        type: type,
        url: location.protocol + '//toxicmeter.herokuapp.com/fill/' + method,
    }
}

function getRequest(type, method) {
    return {
        type: type,
        dataType: 'text',
        data: '',
        async: false,
        url: location.protocol + '//toxicmeter.herokuapp.com/fill/' + method,
        success: function (res) {
            data = res;
            localUpdateLine(data);
        }
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;

    // enable the button
    $('#toxic').removeAttr('disabled');

    setAuth(token);
    
    $.ajax(requests.get);
});

///////////////////////////

function localUpdateLine(amount) {
    $(".progress .water").css("top", 100 - amount + "%");
}

function listenBroadcast(){
    twitch.listen('broadcast', function (target, contentType, currentAmount) {
        localUpdateLine(currentAmount);
    });
}

$(function() {    
    $('#toxic').click(function() {
        if(!token) {return console.log('Not autorized!');}

        $.ajax(requests.set);
    });

    listenBroadcast();
});