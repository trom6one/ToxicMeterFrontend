let token, userId;

const twitch = window.Twitch.ext;

twitch.onContext((context) => {
  twitch.rig.log(context);
  changeCssTheme(context);
});

twitch.onAuthorized((auth) => {
  token = auth.token;
  userId = auth.userId;
});

function changeCssTheme(context){
  if (context.theme == "dark"){
      $('#wrapper').removeClass("dark").addClass('light');
  }
  else{
      $('#wrapper').removeClass("light").addClass('dark');
  }
}
