angular.module('vultr',['ngRoute'])
.config(function($routeProvider) {
  $routeProvider
    .when('/links', {
      templateUrl: 'links.html',
      controller: 'LinksController'
    })
    .when('/submit', {
      templateUrl: 'submit.html',
      controller: 'SubmitController'
    })
    .otherwise({
      redirectTo: '/'
    });
})

.factory('auth', ['$rootScope', '$timeout', function($rootScope, $timeout){
  var ref = new Firebase("https://blistering-heat-2157.firebaseio.com");
  var isNewUser = false;


  // Create a callback to handle the result of the authentication
  var authHandler = function(error, authData) {
    if (error) {
      services.authErrMsg = error.message;
      $rootScope.$broadcast('auth:error');
      $rootScope.$broadcast('auth:unauth');
      console.log("Login Failed!", error);
    } else {
      $rootScope.$broadcast('auth:success');
      $('#myModal').modal('hide');
      console.log("Authenticated successfully with payload:", authData);
    }
  };

  var services = {};

  services.ref = ref;
  services.authData = ref.getAuth();
  services.loggedin = false;
  services.header = '';
  services.footer = '';
  services.authErrMsg = '';

  services.login = function(){
    services.header = 'Log In';
    services.footer = 'Not a user? Signup';
    $rootScope.$broadcast('auth:updated');
    $('#myModal').modal('show');
  };

  services.logout = function(value){
    ref.unauth();
    $rootScope.$broadcast('auth:unauth');
  };

  services.signup= function(){
    services.header = 'Sign up';
    services.footer = 'Already a user? Login';
    $rootScope.$broadcast('auth:updated');
    $('#myModal').modal('show');
  };
   
  services.authRedirect = function(provider){
    ref.authWithOAuthRedirect(provider, authHandler);
  };

  services.authForm = function(userEmail, userPassword){
    ref.authWithPassword({
        email    :  userEmail,
        password :  userPassword
      }, authHandler);
  };

  services.createUser = function(userEmail, userPassword){
    ref.createUser({
      email: userEmail,
      password: userPassword 
    }, function(error, userData) {
      if (error) {
        services.authErrMsg = error.message;
        console.log(services.authErrMsg);
        $rootScope.$broadcast('auth:error');
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $('#myModal').modal('hide');
        $timeout(function(){
          $rootScope.$broadcast('auth:success');
        },3000);
        isNewUser = true;
      }
    });
  };

  ref.onAuth(function(authData) {
    if (authData && isNewUser) {
      ref.child("users").child(authData.uid).set({
        provider: authData.provider,
        name: getName(authData)
      });
    }
  });

  services.getName = function() {
    switch(services.authData.provider) {
       case 'password':
         return services.authData.password.email.replace(/@.*/, '');
       case 'google':
         return services.authData.google.displayName;
       case 'facebook':
         return services.authData.facebook.displayName;
    }
  };


  return services;
}])

.controller('HeaderController', ['$scope', '$location', 'auth', function($scope, $location, auth){
  $scope.loggedin = false;

  if (auth.authData) {
    console.log("User " + auth.authData.uid + " is logged in with " + auth.authData.provider);
    $scope.loggedin = true;
  } else {
    console.log("User is logged out");
  }

  $scope.$on('auth:sucess', function(){
    console.log('hey there');
    $timeout(function(){
      $scope.loggedin = true;
    },5000);
  });

  $scope.$on('auth:unauth', function(){
    $scope.loggedin = false;
  });

  $scope.login = function(){
    $scope.loggedin = true;
    auth.login();
  };
  $scope.logout = auth.logout;
  $scope.signup = auth.signup;

  $scope.submit = function(){
    console.log('submit clicked');
    $location.href = '#/submit';
  };
}])


.controller('ModalController', ['$scope', 'auth', function($scope, auth){

  $scope.authErr = false;
  $scope.authErrMsg = '';
  $scope.alertType = 'alert-success';

  $scope.toggle = function(){
    if (auth.header === 'Log In')
      auth.signup();
    else
      auth.login();
  };
 
  $scope.$on('auth:error', function(){
    $scope.authErrMsg = auth.authErrMsg;
    console.log(auth.authErrMsg);
    $('.modal-body .alert').remove();
    $('.modal-body').prepend('<div ng-show="authErr" ng-model="alertType" class="alert alert-danger" role="alert">'+$scope.authErrMsg+' </div>').animate('fast');
    $('#myModal').modal('show');
    setTimeout(function(){
      $('.modal-body .alert').remove();
    },5000);
    $scope.authErr = false;
  });

  $scope.$on('auth:success', function(){
    $('.modal-body .alert').remove();
  });
    
  $scope.$on('auth:updated', function(){
    $scope.header = auth.header;
    $scope.footer = auth.footer;
  });

  $scope.authRedirect = auth.authRedirect;
    
  $scope.authForm = function(){
    if ($scope.header === "Log In"){
      auth.authForm($scope.userEmail, $scope.userPassword);
    } else {
      auth.createUser($scope.userEmail, $scope.userPassword);
    }
  };
}])

.controller('LinksController', ['$scope', '$location', 'auth', function($scope, $location, auth){
  var ref = new Firebase("https://blistering-heat-2157.firebaseio.com/web/saving-data/fireblog/links");
  $location.href = '#/submit';
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

  ref.once('value', function(data){
    $scope.links = data;
    console.log(data);
  });

  ref.on('value', function(data){
    $scope.links = data;
  });

  $scope.upvote = function(i){
    $scope.links[i].votes++;
  };
  $scope.downvote = function(i){
    $scope.links[i].votes--;
  };
}])

.controller('SubmitController', ['$scope', 'auth', function($scope, auth){

  $scope.submitNewLink = function(value, url, description){
    console.log('submitting new link');
    console.log(value,url,description);
    var postLink = auth.ref.child('links');
    postLink.push({
      value: value,
      url: url,
      votes:0,
      description: description
     });
  };


}]);

