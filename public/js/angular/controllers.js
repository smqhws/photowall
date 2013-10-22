'use strict';

/* Controllers */
angular.module('photowall.controllers', []).
controller('PhotoListCtrl', ['$scope', '$http', 'PhotoScroll','$timeout',
    function($scope, $http, PhotoScroll,$timeout) {
        $scope.photos = new PhotoScroll()
        $scope.currentPhotoIndex = -1
        $scope.photoPageArr = []
        $scope.currentCommentPageArr = []
        $scope.commentPageSize =5
        $scope.comments = []
        $scope.commentPageIndex = []
        $scope.commentPageCount =[]
        $scope.loadingPhoto = false
        $scope.loadingComment = false
        $scope.setCurrent = function(index) {
            $scope.currentPhotoIndex = index
        }
        $scope.$watch('currentPhotoIndex', function(index) {
            if (index >= 0 && index < $scope.photos.items.length) {
                $scope.currentCommentPageIndex = 0
                $scope.currentPhotoId = $scope.photos.items[index].id
                if (!$scope.photos.items[index].addedBy){
                    $scope.loadingPhoto = true
                    $http.get('/jphoto/'+$scope.currentPhotoId).success(function(data){
                        var p = $scope.photos.items[index].uri
                        $scope.currentPhoto = data
                        $scope.currentPhoto.uri = p

                        $scope.photos.items[index] = $scope.currentPhoto
                        $scope.loadingPhoto = false
                    }).error(function(err){
                        $scope.loadingPhoto = false
                    })
                }
                else{
                    $scope.currentPhoto = $scope.photos.items[index]
                }
            }
        })
        $scope.$watch('currentCommentPageIndex',function(){
            if( !$scope.currentCommentPageIndex ){
                $scope.currentCommentPageIndex = $scope.commentPageIndex[$scope.currentPhotoIndex] = $scope.commentPageIndex[$scope.currentPhotoIndex] || 1
                $scope.currentComments = []
                $scope.comments[$scope.currentPhotoIndex]= []
                $scope.currentCommentPageCount = $scope.commentPageCount[$scope.currentPhotoIndex] = $scope.commentPageCount[$scope.currentPhotoIndex]||0
            }
            if(!$scope.currentComments.length && $scope.currentPhotoId)
                $scope.loadingComment =true
                $http.get('/jphoto/'+$scope.currentPhotoId+'/comment?pageSize='+$scope.commentPageSize+'&pageIndex='+$scope.currentCommentPageIndex).success(function(data){
                    if(!data ) return 
                    for(var i in data){
                        $scope.currentComments[i]=(data[i]) 
                        $scope.comments[$scope.currentPhotoIndex][i]=(data[i])
                    }
                    $http.get('/jphoto/'+$scope.currentPhotoId+'/comment/count').success(function(data){
                        $scope.currentCommentPageCount = $scope.commentPageCount[$scope.currentPhotoIndex] = Math.ceil(data.count / $scope.commentPageSize) || 0
                        $scope.loadingComment= false
                    }).error(function(err){
                        $scope.loadingPhoto = false
                    })
                }).error(function(err){
                        $scope.loadingPhoto = false
                })
        })
        $scope.$watch('photos.bigPageCount', function(count) {
            if (count > 0)
                $scope.photoPageArr = _.range(1, count + 1)
        })
        $scope.$watch('currentCommentPageCount',function(count){
            if(count>=0) 
                $scope.currentCommentPageArr = _.range(1, count + 1)
        })

        $scope.addComment = function() {
            $http.post('/jphoto/' + $scope.currentPhotoId + '/comment', {
                content: $scope.newComment
            }).success(function(data) {
                $scope.newComment = ''
                //go to last page
            })
        }
        $scope.nextPhoto = function() {
            $scope.currentPhotoIndex = ($scope.currentPhotoIndex + 1 + $scope.photos.items.length) % $scope.photos.items.length
        }
        $scope.prePhoto = function() {
            $scope.currentPhotoIndex = ($scope.currentPhotoIndex - 1 + $scope.photos.items.length) % $scope.photos.items.length
        }

        $scope.selectCommentPage =function(index){
            $scope.currentComments = []
            $scope.comments[$scope.currentPhotoIndex]= []
            $scope.currentCommentPageIndex = $scope.commentPageIndex[$scope.currentPhotoIndex] = index
        }
        
        
        
    }
])
.controller('GlobalCtrl', ['$scope','$http','$location',
    function($scope,$http,$location) {
        $http.get('/juser/status').success(function (data) {
            $scope.user = data.user||{}
        }).error(function(err){
            $scope.user =$scope.user||{}
            console.log(err)
        })

        $scope.login=function(){
            if($scope.userForm.$invalid) {
                $scope.userForm.email.$dirty = true
                $scope.userForm.password.$dirty = true
                return  
            }
            $http.post('/juser/login',$scope.user).success(function(data){
                if(data.user){
                    $scope.user = data.user
                    $scope.dismiss()
                }
                    
                if(data.info)
                    $scope.info = data.info
                console.log(data)
            }).error(function(err){
                console.log(err)
            })
        }
        $scope.$watch('user',function(){
            $scope.info = false
        },true)
    }
])
.controller('UploadController', ["$scope","$fileUploader","$http","GUID",function ($scope, $fileUploader,$http,GUID) {
    'use strict';
    // create a uploader with options
    var uploader = $scope.uploader = $fileUploader.create({
        scope: $scope,                          // to automatically update the html. Default: $rootScope
        url: 'https://smqhws.s3.amazonaws.com',
        filters: [
            function (item) {                    // first user filter
                console.log('filter1');
                return true;
            }
        ]
    });

    // ADDING FILTER

    uploader.filters.push(function (item) { // second user filter
        console.log('filter2');
        return true;
    });

    // REGISTER HANDLERS

    uploader.bind('afteraddingfile', function (event, item) {
        if(typeof(X2JS)=='undefined' || !X2JS) {
            item.upload = function(){}
            return item.error="JS library load error,Please refresh the page!"
        }
        item.isLoading = true
        $http.get('/jphoto/s3?guid='+ GUID).success(function(retdata){
            item.formData = retdata
            item.isLoading = false
        })
    });

    uploader.bind('afteraddingall', function (event, items) {
        if(typeof(X2JS)=='undefined' || !X2JS) {
            angular.forEach(items,function(key,value){
                value.upload = function  () {}
                items.error = "JS library load error,Please refresh the page!"
            })
            return 
        }
        angular.forEach(items,function(key,value){
            value.isLoading = true
            $http.get('/jphoto/s3?guid='+ GUID).success(function(retdata){
                value.formData = retdata
                value.isLoading = false
            })
        })

    });

    uploader.bind('success', function (event, xhr, item) {
        var resJson = new X2JS().xml_str2json(xhr.response)
        item.file.name = resJson.PostResponse.Key.slice(resJson.PostResponse.Key.lastIndexOf("/")+1)
        item.uri = resJson.PostResponse.Location

    });

    uploader.bind('error',function(event,xhr,item){
        var resJson = new X2JS().xml_str2json(xhr.response)
        item.error = resJson.Error.Code
    })

}]);
// .controller('DemoFileUploadController', [
//     '$scope', '$http', '$filter', '$window', 'Photo',
//     function($scope, $http) {
//         $scope.queue = []
//         $scope.allPhoto = function() {
//             var arr = _.clone($scope.queue)
//             _.each(arr, function(elm) {
//                 if (elm.url)
//                     $http.post('/jphoto', {
//                         name: elm.name,
//                         desc: elm.desc
//                     }).then(function() {
//                         $scope.clear(elm)
//                     },function() {
//                         elm.error = {msg:'create photo error'}
//                     })
//             })
//         }
//     }
// ]).controller('FileDestroyController', [
//     '$scope', '$http',
//     function($scope, $http) {
//         var file = $scope.file,
//             state;
//         if (file.url) {
//             file.$state = function() {
//                 return state;
//             };
//             file.$destroy = function() {
//                 state = 'pending';
//                 return $http({
//                     url: file.deleteUrl,
//                     method: file.deleteType
//                 }).then(
//                     function() {
//                         state = 'resolved';
//                         $scope.clear(file);
//                     },
//                     function() {
//                         state = 'rejected';
//                     }
//                 );
//             };
//             $scope.newPhoto = function() {
//                 $http.post('/jphoto', {
//                     name: file.name,
//                     desc: file.desc
//                 }).success(function(data) {
//                     $scope.clear(file)
//                 }).error(function(data) {
//                     file.error = {msg:'create photo err'}
//                 })
//             }
//         } else if (!file.$cancel && !file._index) {
//             file.$cancel = function() {
//                 $scope.clear(file);
//             };
//         }
//     }
// ]);