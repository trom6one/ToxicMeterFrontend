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
    // % text
    var top = $("#water")[0].style.top;
    $('#percent').text((100 - parseFloat(top)).toFixed(1) + '%');
    
    // $(".progress .water").css("top", 100 - amount + "%");

    $(".progress .water").animate({ top: 100 - amount + "%" }, 'easeInOutCubic', function(){ 
        /* animation comlete */ 
    });

}

function listenBroadcast(){
    twitch.listen('broadcast', function (target, contentType, currentAmount) {
        localUpdateLine(currentAmount);
    });
}

///

var uiFeedbackStarted = false;
function uiFeedback() {
    if(!uiFeedbackStarted){
        uiFeedbackStarted = true;
        $("#inner").append('<div id="one" class="waterdrop-one"></div>');
        var random = randomInteger(30, 70);
        $('.waterdrop-one').css('left', random+'%').addClass('waterdrop-one-animation');

        setTimeout(function() {
                $('#one').remove();
                uiFeedbackStarted = false;
            }, 1000)
    }
}


///

$(function() {    
    $('#toxic').click(function() {
        console.log("click")
        if(!token) {return console.log('Not autorized!');}

        uiFeedback();

        $.ajax(requests.set);
    });
    listenBroadcast();
});

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

