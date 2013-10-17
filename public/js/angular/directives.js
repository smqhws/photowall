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
                    imgClass: '@'
                },
                template: '<div ng-class="{loading:loading,broken:broken}"><img class="{{imgClass}} img-center" src="{{imgSrc}}"/></div>',
                link: function(scope, elm, attrs) {
                    scope.loading = true
                    scope.broken = false
                    scope.$watch('imgSrc', function(src) {
                        if (!src) return
                        scope.loading = true
                        scope.broken = false
                        var imgLoad = imagesLoaded(elm, function() {
                            scope.$apply(function() {
                                if (imgLoad.images.length != 1)
                                    return
                                    // $timeout(function(){

                                //  },500)
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
                    setCurrent: '&',
                    srcName: '@',
                    modalTarget: '@'
                },
                template: '<div class="row pin-wall">' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '</div>',
                link: function(scope, elm, attrs) {
                    var cols = $(elm).find('.pin-col')
                    var width = cols.width()
                    scope.pinNumber = 0
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
                        if (!scope.items || scope.pinNumber >= scope.items.length)
                            return
                        fn(scope.items[scope.pinNumber][scope.srcName],
                            function(img) {

                                if (img.type === "error") {
                                    scope.items[scope.pinNumber][scope.srcName] = 'http://www.placehold.it/320x480/EFEFEF/AAAAAA&text=image + load+ error'
                                } else {
                                    var wrapper = $('<div class="pin"></div>')
                                    var elm = $('<a ng-click="setCurrent({index:' + scope.pinNumber + '})" data-toggle="modal" data-target="' + scope.modalTarget + '"></>')
                                    elm.append(img)
                                    wrapper.append(elm)
                                    $compile(wrapper)(scope)
                                    getMin(cols.toArray()).append(wrapper)
                                    scope.pinNumber++
                                }
                                load(loadImage)
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

                        load(loadImage)
                    }, true)


                }
            }
        }
    ])







// one by one append img