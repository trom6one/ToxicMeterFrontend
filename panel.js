var token = "";
var tuid = "";
var ebs = "";

const helpUrlEng = "https://docs.google.com/document/d/e/2PACX-1vQxQnaIyGGyFOVftRG6Mfoj85xxV8N3r_4pkpBYeMTnx8YJKU1ZscnKduDM5lE40ULuk3FckTbTc5ft/pub"
const helpUrlRus = "https://docs.google.com/document/d/e/2PACX-1vQr3kGqHZKu7YCSZ40TybkN1rhRec6xKMYwaP0XXKNqDvyGI4RFLpOYozJzXaASzYDAG0i13UYBGoTz/pub"


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
    $('#button-toxic').removeAttr('disabled');

    setAuth(token);
    
    $.ajax(requests.get);
});

///////////////////////////
function localUpdateLine(amount) {
    $(".progress .water").css("top", 100 - amount + "%");
    // $(".progress .water").animate({ top: 100 - amount + "%" }, 'easeInOutCubic', function(){ 
    //     /* animation comlete */ 
    // });

    // % text
    var top = $("#water")[0].style.top;
    $('#percent').text((100 - parseFloat(top)).toFixed(1) + '%');
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
    // $('#panel-right').click(function() {
    //     if($('#panel-right').hasClass("panel-right-closed")){
    //         $('#panel-right').removeClass('panel-right-closed');
    //     }
    //     else{
    //         $('#panel-right').addClass('panel-right-closed');
    //     }
    // });   

    $("#button-help").click(function() {
        var language = twitch.onContext(function(context) {return context.language });
        console.log(`language = ${language}`);
        var url = language == "ru" ? helpUrlRus : helpUrlEng;
        console.log(`url = ${url}`);
        window.open(url, "_blank");
    });

    $('#button-toxic').click(function() {
        // console.log("click")
        if(!token) {return console.log('Not autorized!');}

        uiFeedback();

        $.ajax(requests.setPlus);
    });

    $('#button-untoxic').click(function() {
        // console.log("click")
        if(!token) {return console.log('Not autorized!');}

        $.ajax(requests.setMinus);
    });

    listenBroadcast();
});

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

