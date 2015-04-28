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

