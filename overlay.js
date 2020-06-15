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

///

$(function() {    
    var green = $("#green");

    $('#button-toxic').click(function() {
        if(!token) {return console.log('Not autorized!');}
        uiFeedback();
        $.ajax(requests.setPlus);
    });

    $('#button-detox').click(function() {
        if(!token) {return console.log('Not autorized!');}
        $.ajax(requests.setMinus);
    });

    // NOTE Добавляем класс, чтобы уменьшить круг
    // BUG Если класс заранее добавлен в HTML, "жидкость" размыта
    // $("#green").addClass("small");
    
    $('#button-minimize').click(function() {
        if(!token) {return console.log('Not autorized!');}
        green.addClass("small");
    });

    $('#button-hide').click(function() {
        if(!token) {return console.log('Not autorized!');}
        green.addClass("hide");
        green.addClass("small");
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

    moveHandler();
});

async function moveHandler(){
    var mousePosition;
    var offsetDragable = [0,0];
    var clientOrigin = [0,0];
    var isDown = false;

    var dragable = document.getElementById("green");
    var green = $("#green");

    dragable.addEventListener('mousedown', function(e) {
        isDown = true;
        offsetDragable = [
            dragable.offsetLeft - e.clientX,
            dragable.offsetTop - e.clientY
        ];
        clientOrigin = [
            e.clientX,
            e.clientY
        ];
        green.removeClass("grab");
        green.addClass("grabbing");
    }, true);
    
    document.addEventListener('mouseup', function(e) {
        isDown = false;
        green.removeClass("grabbing");
        green.addClass("grab");

        var xDiff = Math.abs(clientOrigin[0]) - Math.abs(e.clientX);
        var yDiff = Math.abs(clientOrigin[1]) - Math.abs(e.clientY);

        if((Math.abs(xDiff) < 2 || Math.abs(yDiff) < 2)){
            green.removeClass("hide");
            green.removeClass("small");
        }
    }, true);
    
    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {
                x : event.clientX,
                y : event.clientY
            };
            dragable.style.left = (mousePosition.x + offsetDragable[0]) + 'px';
            dragable.style.top  = (mousePosition.y + offsetDragable[1]) + 'px';
        }
    }, true);
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}







