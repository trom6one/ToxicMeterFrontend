var token = "";
var tuid = "";
var ebs = "";

const infoPageUrl = "https://docs.google.com/document/d/e/2PACX-1vQxQnaIyGGyFOVftRG6Mfoj85xxV8N3r_4pkpBYeMTnx8YJKU1ZscnKduDM5lE40ULuk3FckTbTc5ft/pub";
const feedbackFormUrl = "https://forms.gle/58P1eFv2PRDmz1PVA";

var twitch = window.Twitch.ext;
let channelId = "";

var requests = {
    get: getRequest('GET', 'query')
};

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
        },
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        requests[req].headers = { 'Authorization': 'Bearer ' + token}
    });
}

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;

    channelId = auth.channelId;

    // enable the button
    // $('#maxAmount').removeAttr('disabled');

    setAuth(token);
    
    $.ajax(requests.get);
});

///

$(function() {
    $('#getObsOverlay').click(function() {
        if(!token) {return console.log('Not autorized!');}

        window.open(`https://toxicmeter.herokuapp.com/obs-overlay.html?channel=${channelId}`, '_blank');
    });

    $('#botActivate').click(function() {
        if(!token) {return console.log('Not autorized!');}

        var url = `https://toxicmeterbot.herokuapp.com/activate?channel=${channelId}`;
        var request = $.get(url, function() {
            alert( "success" );
        })
        .done(function() {
            alert( "second success" );
        })
        .fail(function() {
            alert( "error" );
        })
        .always(function() {
            alert( "finished" );
        });
        
        request.always(function() {
            alert( "second finished" );
        });
    });

    $('#botDeactivate').click(function() {
        if(!token) {return console.log('Not autorized!');}

        window.open('', '_blank');
    });

    $('#botConfig').click(function() {
        if(!token) {return console.log('Not autorized!');}
        window.open(`https://toxicmeterbot.herokuapp.com/config.html?channel=${channelId}`, '_blank');
    });

    $('#button-feedback').click(function() {
        if(!token) {return console.log('Not autorized!');}
        window.open(feedbackFormUrl, '_blank');
    });

    $('#button-info').click(function() {
        if(!token) {return console.log('Not autorized!');}
        window.open(infoPageUrl, '_blank');
    });
});
