'use strict';

/* Controllers */
var url = '/uploads'
angular.module('photowall.controllers', []).
controller('PhotoListCtrl', ['$scope', '$http', 'PhotoScroll', 'Photo',
    function($scope, $http, PhotoScroll, Photo) {
        $scope.photos = new PhotoScroll()
        $scope.current_index = -1
        $scope.page_arr = []
        $scope.setCurrent = function(index) {
            $scope.current_index = index
        }
        $scope.$watch('current_index', function() {
            if ($scope.current_index >= 0 && $scope.current_index < $scope.photos.items.length) {
                $scope.current_id = $scope.photos.items[$scope.current_index]._id
                if (!$scope.photos.items[$scope.current_index].addedBy)
                    Photo.get({
                        photoId: $scope.current_id
                    }, function(data) {
                        var p = $scope.photos.items[$scope.current_index].path
                        $scope.current_photo = data
                        $scope.current_photo.path = p
                        $scope.photos.items[$scope.current_index] = $scope.current_photo
                    })
                else
                    $scope.current_photo = $scope.photos.items[$scope.current_index]
            }
        })
        $scope.$watch('photos.bigPageCount', function() {
            if ($scope.photos.bigPageCount >= 0)
                $scope.page_arr = _.range(1, $scope.photos.bigPageCount + 1)
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
        $scope.editPhoto = function() {
            console.log('..........')
            var editModal = $('#edit-photo-modal')
            editModal.load('/jphoto/' + $scope.current_id + '/edit', '', function() {
                editModal.modal();
            })

        }

    }
]).controller('GlobalCtrl', ['$scope',
    function($scope) {
        $scope.photo = null
        $scope.user = null
    }
]).controller('DemoFileUploadController', [
    '$scope', '$http', '$filter', '$window',
    function($scope, $http) {
        $scope.options = {
            url: url
        };
        $scope.loadingFiles = true;
        $http.get(url)
            .then(
                function(response) {
                    $scope.loadingFiles = false;
                    $scope.queue = response.data.files || [];
                },
                function() {
                    $scope.loadingFiles = false;
                }
        );
    }
]).controller('FileDestroyController', [
    '$scope', '$http',
    function($scope, $http) {
        var file = $scope.file,
            state;
        if (file.url) {
            file.$state = function() {
                return state;
            };
            file.$destroy = function() {
                state = 'pending';
                return $http({
                    url: file.deleteUrl,
                    method: file.deleteType
                }).then(
                    function() {
                        state = 'resolved';
                        $scope.clear(file);
                    },
                    function() {
                        state = 'rejected';
                    }
                );
            };
            $scope.newPhoto=function(){
                $http.post('/jphoto',{name:file.name,desc:file.desc}).success(function(data){
                    $scope.clear(file)
                }).error(function(data){
                    file.error = true
                })
            }
        } else if (!file.$cancel && !file._index) {
            file.$cancel = function() {
                $scope.clear(file);
            };
        }
    }
]);