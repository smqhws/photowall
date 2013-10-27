'use strict'

/* Directives */


angular.module('photowall.directives', [])
    .directive('appVersion', ['version',
        function(version) {
            return function(scope, elm, attrs) {
                elm.text(version)
            }
        }
    ])
    .directive('selfHide',[
        function () {
            return {
                restrict:'A',
                link:function(scope,elm,attrs){
                    scope.dismiss = function() {
                        $(elm).modal('hide')
                    }
                }
            }
            
        }
    ])
    .directive('imgloaded', ['$timeout',
        function($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    imgSrc: "@",
                    imgClass: '@',
                    imgWidth:"@"
                },
                template: '<div><img class="img-center" alt="load error" src="http://www.placehold.it/240x320/EFEFEF/AAAAAA&text=no+image" ng-show="broken"/><img class="img-center" alt="loading now" src="/img/ajax-loader.gif" ng-show="loading"><div ng-class="{loading:loading,broken:broken}"><img class="{{imgClass}} img-center" ng-src="{{imgSrc}}" width="{{imgWidth}}" /></div></div>',
                link: function(scope, elm, attrs) {
                    scope.loading = true
                    scope.broken = false
                    if(!scope.imgSrc) scope.imgSrc = ''
                    scope.$watch('imgSrc', function(src) {
                        if (!src) return
                        scope.loading = true
                        scope.broken = false
                        var imgLoad = imagesLoaded($(elm).children('div'), function() {
                            scope.$apply(function() {
                                if (imgLoad.images.length != 1)
                                    return
                                scope.broken = !imgLoad.images[0].isLoaded
                                scope.loading = false
                            })
                        })
                    })

                }
            }
        }
    ])
    .directive('contentloaded', ['$timeout',
        function($timeout) {
            return {
                restrict: 'EA',
                replace: true,
                template: '<div><img class="img-responsive img-center" src="/img/ajax-loader.gif"/></div>'
            }
        }
    ])
    .directive('pinerest', ['$compile',
        function($compile) {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    items: '=',
                    status:'=',
                    srcName: '@',
                    modalTarget: '@',
                    currentPhotoIndex:'='
                },
                template: '<div class="row pin-wall">' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '</div>',
                link: function(scope, elm, attrs) {
                    var cols = $(elm).find('.pin-col')
                    var width = cols.width()
                    scope.pinNumber = 0
                    scope.setCurrentPhoto = function(index){
                        scope.currentPhotoIndex = index 
                    }
                    var getMin = function(arr) {
                        var min = 0
                        for (var i = 0; i < arr.length; i++) {
                            if ($(arr[i]).height() < $(arr[min]).height()) {
                                min = i
                            } else if ($(arr[i]).height() == $(arr[min]).height()) {
                                if (i < min)
                                    min = i
                            }
                        }
                        return $(arr[min])
                    }
                    var load = function(fn) {
                        if (!scope.items )
                            return
                        if(scope.pinNumber >= scope.items.length){
                            scope.status.globalLoading = false
                            return
                        }
                        var index = scope.pinNumber
                        fn(scope.items[index][scope.srcName],
                            function(img) {
                                scope.$apply(function(){
                                    if (img.type === "error") {
                                    scope.items[index][scope.srcName] = 'http://www.placehold.it/320x480/EFEFEF/AAAAAA&text=image + load+ error'
                                    load(loadImage)
                                    } else {
                                        var wrapper = $('<div class="pin"></div>')
                                        var elm = $('<a ng-click="setCurrentPhoto(' + index + ')" data-toggle="modal" data-target="' + scope.modalTarget + '"></>')
                                        elm.append(img)
                                        wrapper.append(elm)
                                        var wrapperObject = $compile(wrapper)(scope,function(wrapperObject){
                                            getMin(cols.toArray()).append(wrapperObject)
                                            scope.pinNumber++
                                            load(loadImage)
                                        })
                                    }
                                })
                            }, {
                                maxWidth: width
                            })
                    }

                    

                    var contains = function(now, old) {
                        var i = 0
                        if (!old || !now || !now.length)
                            return false
                        if (!old.length)
                            return true
                        for (i = 0; i < old.length; i++) {
                            if (now[i].id !== old[i].id)
                                break
                        }
                        return i === old.length
                    }
                    scope.$watch('items', function(now, old) {
                        if (!now || !now.length) {
                            cols.empty()
                            scope.pinNumber = 0
                        } else if (!contains(now, old)) {
                            cols.empty()
                            scope.pinNumber = 0
                        }
                        scope.status.globalLoading = true
                        load(loadImage)
                    }, true)


                }
            }
        }
    ])







// one by one append img

// var load = function() {
                    //     if(scope.busy){
                    //         return $timeout(load,100)
                    //     }
                    //     scope.busy = true  
                    //     if (!scope.items ){
                    //         scope.busy=false
                    //         return
                    //     }
                            
                    //     if(scope.pinNumber >= scope.items.length){
                    //         scope.busy = false
                    //         scope.status.globalLoading = false
                    //         return
                    //     }
                    //     var wrapper = $('<div class="pin"></div>')
                    //     var elm = $('<a ng-click="setCurrentPhoto(' + scope.pinNumber + ')" data-toggle="modal" data-target="' + scope.modalTarget + '"></>')
                    //     elm.append('<img src="'+scope.items[scope.pinNumber][scope.srcName]+'" width="'+width+'" />')
                    //     wrapper.append(elm)
                    //     var wrapperObject = $compile(wrapper)(scope,function(wrapperObject){
                    //         var imgLoad = imagesLoaded(wrapperObject, function() {
                    //             scope.$apply(function() {
                    //                 getMin(cols.toArray()).append(wrapperObject)
                    //                 scope.pinNumber++
                    //                 scope.busy = false
                    //                 load()
                    //             })
                    //         })
                            
                    //     })
                        
                    // }