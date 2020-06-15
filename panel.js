var token = "";
var tuid = "";
const ebs = "toxicmeter.herokuapp.com";

const infoPageUrl = "https://docs.google.com/document/d/e/2PACX-1vQxQnaIyGGyFOVftRG6Mfoj85xxV8N3r_4pkpBYeMTnx8YJKU1ZscnKduDM5lE40ULuk3FckTbTc5ft/pub";
const feedbackFormUrl = "https://forms.gle/58P1eFv2PRDmz1PVA";

// because who wants to type this every time?
var twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
var requests = {
    setPlus: postRequest('POST', 'amount'),
    setMinus: postRequest('POST', 'demount'),
    get: getRequest('GET', 'query')
};

function postRequest(type, method) {
    return {
        type: type,
        // url: location.protocol + '//toxicmeterdev.herokuapp.com/fill/' + method,
        url: `${location.protocol}//${ebs}/fill/${method}`,
    }
}

function getRequest(type, method) {
    return {
        type: type,
        dataType: 'text',
        data: '',
        async: false,
        // url: location.protocol + '//toxicmeterdev.herokuapp.com/fill/' + method,
        url: `${location.protocol}//${ebs}/fill/${method}`,
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

    setAuth(token);
    
    $.ajax(requests.get);
});

///

function localUpdateLine(amount) {
    $('#percent').text(parseFloat(amount).toFixed(1) + '%');

    $("#water").css("opacity", (40.0 + parseFloat(amount)).toFixed(1) + "%");

    $(".progress .water").animate({ top: 100 - amount + "%"}, 'easeInOutCubic', function(){ 
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

$(function() {    

    $('#button-toxic').click(function() {
        if(!token) {return console.log('Not autorized!');}
        uiFeedback();
        $.ajax(requests.setPlus);
    });

    $('#button-detox').click(function() {
        if(!token) {return console.log('Not autorized!');}
        $.ajax(requests.setMinus);
    });

    $('#button-feedback').click(function() {
        if(!token) {return console.log('Not autorized!');}
        window.open(feedbackFormUrl, '_blank');
    });

    $('#button-info').click(function() {
        if(!token) {return console.log('Not autorized!');}
        window.open(infoPageUrl, '_blank');
    });

    listenBroadcast();
});

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}







