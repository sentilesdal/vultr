angular.module('vultr',[])

.factory('modal', ['$rootScope', function($rootScope){
  var services = {};
  
  services.header = '';
  services.footer = '';

  services.login = function(){
    services.header = 'Log In';
    services.footer = 'Not a user? Signup';
    $rootScope.$broadcast('modal:updated');
  };

  services.signup= function(){
    services.header = 'Sign up';
    services.footer = 'Already a user? Login';
    $rootScope.$broadcast('modal:updated');
  };
    

  return services;
}])

.controller('HeaderController', ['$scope', 'modal', function($scope, modal){
  $scope.login = modal.login;
  $scope.signup = modal.signup;

}])

.controller('ModalController', ['$scope', 'modal', function($scope, modal){

  $scope.toggle = function(){
    if (modal.header === 'Log In')
      modal.signup();
    else
      modal.login();
  };

  $scope.$on('modal:updated', function(){
    $scope.header = modal.header;
    $scope.footer = modal.footer;
  });
  
}])

.controller('LinksController', ['$scope', function($scope){
  $scope.links = [
                   {
                     url:'www.link1.com', 
                     votes:0
                   },
                   {
                     url:'www.link2.com',
                     votes:0
                   }
                 ];

  $scope.upvote = function(i){
    $scope.links[i].votes++;
  };
  $scope.downvote = function(i){
    $scope.links[i].votes--;
  };
}]);

var ref = new Firebase("https://blistering-heat-2157.firebaseio.com");
var authData = ref.getAuth();

if (authData) {
  console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
  console.log("User is logged out");
}

// Create a callback to handle the result of the authentication
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
    console.log("Login Failed!", authData);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

// Authenticate users with a custom Firebase token
//ref.authWithCustomToken("<token>", authHandler);

// Alternatively, authenticate users anonymously
//ref.authAnonymously(authHandler);

// Or with an email/password combination
ref.authWithPassword({
  email    : 'bobtony@firebase.com',
  password : 'correcthorsebatterystaple'
}, authHandler);

// Or via popular OAuth providers ("facebook", "github", "google", or "twitter")
//ref.authWithOAuthRedirect("facebook", authHandler);
//ref.authWithOAuthRedirect("google", authHandler);

// we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean
var isNewUser = true;

ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into Firebase so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
    });
  }
});

// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}
