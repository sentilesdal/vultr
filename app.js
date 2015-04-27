angular.module('vultr',[])
.controller('HeaderController', ['$scope', function($scope){
  $scope.links = ['Signup', 'Login'];

}])
.controller('LinksController', ['$scope', function($scope){
  $scope.links = ['www.link1.com', 'www.link2.com'];
}]);


