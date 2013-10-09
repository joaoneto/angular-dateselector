var app = angular.module('app', ['ngDateSelector']);

function AppCtrl($scope) {
  $scope.birthday = '1983-04-01';
  $scope.go = function () {
  	console.log($scope.birthday)
  };
}

