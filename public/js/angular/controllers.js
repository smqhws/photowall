'use strict';

/* Controllers */

angular.module('photowall.controllers', []).
controller('PhotoListCtrl', ['$scope', '$http',
    function($scope, $http) {
        $http.get('/json/').success(function(data) {
            $scope.photos = data.objs
            $scope.pageIndex = data.pageIndex
            $scope.pageSize = data.pageSize
            $scope.pageCount = data.pageCount
            
        })
    }
]).controller('MyCtrl2', [
    function() {

    }
])