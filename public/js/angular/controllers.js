'use strict';

/* Controllers */

angular.module('photowall.controllers', []).
controller('PhotoListCtrl', ['$scope', '$http', 'Photo',
    function($scope, $http, Photo) {
        $scope.photo = new Photo()
        $scope.current_photo = {}
        $scope.new_comment = ''
        $scope.setCurrent = function(obj) {
            $scope.current_photo = obj
        }
        $scope.addComment = function() {
            $http.post('/photo/' + $scope.current_photo._id + '/comment', {
                content: $scope.new_comment
            }).success(function(data){
                $scope.current_photo.comment.push(data)
            })
        }
    }
]).controller('MyCtrl2', [
    function() {

    }
])