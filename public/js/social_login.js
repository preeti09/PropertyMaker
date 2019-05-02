//social login 
var auth2;
window.fbAsyncInit = function () {
    FB.init({
        appId: '496575730781378',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
    });
    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function Googlelogin() {
    var config = {
//      client_id: '654171435117-dtgfme2hp5t7dvn8re7ssrefhjkso0cb.apps.googleusercontent.com',
        client_id: '830560915397-ed9uldu2m66v3mf2fe82lbgqtjkec1c3.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
    };
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init(config);
        startApp('googlebtn');
        startApp('googlebtn1');
    })
}

var startApp = function (id) {
    element = document.getElementById(id);
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            var profile = auth2.currentUser.get().getBasicProfile();
            var data = {
                first_name: profile.getGivenName(),
                last_name: profile.getFamilyName(),
                user_name: profile.getName(),
                email: profile.getEmail(),
                profile_image: profile.getImageUrl().split("?sz=50")[0] + "?sz=" + 300,
            };

            $.ajax({
                url: '/registration/socialLogin',
                type: 'post',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (res) {
                    var res = JSON.parse(res);
                    if (res.loginstatus == 'error') {
                        $('#login_alertMsg').html('<div class="alert alert-danger"><strong> '+res.msg+' </strong></div>').show();
                        $('#login_alertMsg').delay(10000).fadeOut('slow');
                    } else if (res.loginstatus == 'success') {
                        window.location.href = res.url;
                    }
                }
            });
        },
        function (error) {
            //$('#login_alertMsg').html('<div class="alert alert-danger"><strong> ' + error.error.split('_').join(' ') + ' </strong></div>').show();
            //$('#login_alertMsg').delay(10000).fadeOut('slow');
        });
};

function Facebooklogin() {
    FB.login(function (response) {
        if (response.status === 'connected') {
            FB.api('/me?fields=id,first_name,last_name,gender,email,name', function (response) {

                if (response.email != "") {
                    getfacebook(response);
                } else {
                    $('#login_alertMsg').html('<div class="alert alert-danger"><strong>Email address not found.</strong></div>').show();
                    $('#login_alertMsg').delay(10000).fadeOut('slow');
                }
            });
        } /* else {
            $('#login_alertMsg').html('<div class="alert alert-danger"><strong>User cancelled login or did not fully authorize.</strong></div>').show();
            $('#login_alertMsg').delay(10000).fadeOut('slow');
        } */
    }, {
        scope: 'public_profile,email'
    });
}

function getfacebook(data) {
    data.profile_image = 'https://graph.facebook.com/' + data.id + '/picture?type=large';
    data.usertype = 2;

    $.ajax({
        url: '/registration/socialLogin',
        type: 'post',
        data: data,
        dataType: 'json',
        success: function (res) {
            if (res == 'error') {
                $('#login_alertMsg').html('<div class="alert alert-danger"><strong> Something went wrong. Please try again. </strong></div>').show();
                $('#login_alertMsg').delay(10000).fadeOut('slow');
            } else {
                window.location.href = res.url;
            }

        }
    });
}
//social login
