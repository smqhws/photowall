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
                    setCurrent: '&',
                    pin_number: '=pinNumber'
                },
                template: '<div class="row-fluid pin-wall">' + '<div class="span3 pin-col"></div>' + '<div class="span3 pin-col"></div>' + '<div class="span3 pin-col"></div>' + '<div class="span3 pin-col"></div>' + '</div>',
                link: function(scope, elm, attrs) {
                    var cols = $(elm).find('.pin-col')

                    var getMin = function(arr) {
                        var min = arr.first()
                        arr.each(function() {
                            if ($(this).height() < min.height())
                                min = $(this)
                        })
                        return min
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
                                    getMin(cols).append(wrapper)
                                    scope.pin_number++
                                }
                                load(loadImage)
                            }, {
                                maxWidth: 320
                            })
                    }

                    scope.$watch('items', function() {
                        console.log('---------------------')
                        console.log(JSON.stringify(scope.items))
                        console.log(JSON.stringify(scope.pin_number))
                        console.log('---------------------')
                        if (!scope.items || !scope.items.length)
                            return
                        if(!scope.pin_number)
                            cols.empty()
                        load(loadImage)
                    },true)


                }
            }
        }
    ])







// one by one append img