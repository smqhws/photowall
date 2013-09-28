'use strict';

/* Directives */


angular.module('photowall.directives', [])
    .directive('appVersion', ['version',
        function(version) {
            return function(scope, elm, attrs) {
                elm.text(version)
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
                    setCurrent: '&'
                },
                template: '<div class="row pin-wall">' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '<div class="col-md-3 pin-col"></div>' + '</div>',
                link: function(scope, elm, attrs) {
                    var cols = $(elm).find('.pin-col')
                    var width = cols.width()
                    scope.pin_number = 0
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
                        if (!scope.items || scope.pin_number >= scope.items.length)
                            return
                        fn(scope.items[scope.pin_number].path,
                            function(img) {

                                if (img.type === "error") {
                                    console.log("Error loading image " + scope.items[scope.pin_number].path)
                                    scope.items[scope.pin_number].path = 'http://www.placehold.it/320x480/EFEFEF/AAAAAA&text=image + load+ error'
                                } else {
                                    var wrapper = $('<div class="pin"></div>')
                                    var elm = $('<a ng-click="setCurrent({index:' + scope.pin_number + '})" data-toggle="modal" data-target="#photo-modal"></>')
                                    elm.append(img)
                                    wrapper.append(elm)
                                    $compile(wrapper)(scope)
                                    getMin(cols.toArray()).append(wrapper)
                                    scope.pin_number++
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
                            if (now[i]._id !== old[i]._id)
                                break
                        }
                        return i === old.length
                    }
                    scope.$watch('items', function(now, old) {
                        if (!now || !now.length) {
                            cols.empty()
                            scope.pin_number = 0
                        } else if (!contains(now, old)) {
                            cols.empty()
                            scope.pin_number = 0
                        }

                        load(loadImage)
                    }, true)


                }
            }
        }
    ])







// one by one append img