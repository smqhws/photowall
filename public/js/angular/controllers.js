'use strict';

/* Controllers */

angular.module('photowall.controllers', []).
controller('PhotoListCtrl', ['$scope', '$http', 'Photo',
    function($scope, $http, Photo) {
        $scope.photos = new Photo()
        $scope.current_index = -1

        $scope.page_arr = []
        $scope.setCurrent = function(index) {
            $scope.current_index = index
        }
        $scope.$watch('current_index', function() {
            if ($scope.current_index >= 0 && $scope.current_index < $scope.photos.items.length) {
                $scope.current_id = $scope.photos.items[$scope.current_index]._id
                if (!$scope.photos.items[$scope.current_index].addedBy)
                    $http.get('/photo/' + $scope.current_id).success(function(data) {
                        var p = $scope.photos.items[$scope.current_index].path
                        $scope.current_photo = data.photo
                        $scope.current_photo.path = p
                        $scope.photos.items[$scope.current_index] = $scope.current_photo
                    })
                else
                    $scope.current_photo = $scope.photos.items[$scope.current_index]
            }
        })
        $scope.$watch('photos.bigPageCount',function(){
            if($scope.photos.bigPageCount>=0)
                $scope.page_arr = _.range(1,$scope.photos.bigPageCount+1)
        })
        $scope.addComment = function() {
            $http.post('/photo/' + $scope.current_id + '/comment', {
                content: $scope.new_comment
            }).success(function(data) {
                $scope.current_photo.comment.push(data)
                $scope.new_comment = ''
            })
        }
        $scope.nextPhoto = function() {
            $scope.current_index = ($scope.current_index + 1 + $scope.photos.items.length) % $scope.photos.items.length
        }
        $scope.prePhoto = function() {
            $scope.current_index = ($scope.current_index - 1 + $scope.photos.items.length) % $scope.photos.items.length
        }

    }
]).controller('MyCtrl2', [
    function() {

    }
])