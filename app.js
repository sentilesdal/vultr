angular.module('vultr',[])
.controller('HeaderController', ['$scope', function($scope){
  $scope.links = ['Signup', 'Login'];

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
    console.log('i',i);
    $scope.links[i].votes++;
  };
  $scope.downvote = function(i){
    $scope.links[i].votes--;
  };
}]);


