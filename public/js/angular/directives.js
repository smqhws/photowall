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
    .directive('pinerest', ['$compile','$timeout',
        function($compile,$timeout) {
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
                    var errorImg = 'http://www.placehold.it/320x480/EFEFEF/AAAAAA&text=image + load+ error'
                    scope.pinNumber = 0
                    scope.wrappers = []
                    scope.wrappersHide = []
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
                    // var load = function(fn) {
                    //     if (!scope.items )
                    //         return
                    //     if(scope.pinNumber >= scope.items.length){
                    //         scope.status.globalLoading = false
                    //         return
                    //     }
                    //     var index = scope.pinNumber
                    //     var min = getMin(cols.toArray())
                    //     var wrapper = $('<div class="pin"><a ng-click="setCurrentPhoto(' + index + ')" data-toggle="modal" data-target="' + scope.modalTarget + '"></></div>')
                    //     fn(scope.items[index][scope.srcName],
                    //         function(img) {
                    //             scope.$apply(function(){
                    //                 if (img.type === "error") {
                    //                     scope.items[index][scope.srcName] = 'http://www.placehold.it/320x480/EFEFEF/AAAAAA&text=image + load+ error'
                    //                     load(loadImage)
                    //                 } else {
                    //                     wrapper.append(img)
                    //                     $compile(wrapper)(scope,function(wrapperObject){
                    //                         console.log(index,wrapperObject.find('img'))
                    //                         min.append(wrapperObject)
                    //                         scope.pinNumber++
                    //                         load(loadImage)
                    //                     })
                    //                 }
                    //             })
                    //         }, {
                    //             maxWidth: width
                    //         })
                    // }
                    // var load = function(fn) {
                    //     if (!scope.items )
                    //         return
                    //     if(scope.pinNumber >= scope.items.length){
                    //         scope.status.globalLoading = false
                    //         return
                    //     }
                    //     var index = scope.pinNumber
                    //     console.log(index)
                    //     var min = getMin(cols.toArray())
                    //     var wrapper = $('<div class="pin"><a></a></div>')
                    //     wrapper.on('click',function(){
                    //         scope.$apply(function(){
                    //             scope.currentPhotoIndex = index 
                    //             $(scope.modalTarget).modal()
                    //         })
                    //     })
                    //     fn(scope.items[index][scope.srcName],
                    //         function(img) {
                    //             scope.$apply(function(){
                    //                 if (img.type === "error") {
                    //                     scope.items[index][scope.srcName] = errorImg
                    //                     load(loadImage)
                    //                 } else {
                    //                     console.log(index,img,wrapper)
                    //                     wrapper.append(img)
                    //                     min.append(wrapper)
                    //                     scope.pinNumber++
                    //                     load(loadImage)
                    //                 }
                    //             })
                    //         }, {
                    //             maxWidth: width
                    //         })
                    // }

                    

                    var contains = function(now, old) {
                        var i = 0
                        if (!old || !now || !now.length || !old.length)
                            return false
                        for (i = 0; i < old.length; i++) {
                            if (now[i].id !== old[i].id)
                                break
                        }
                        return i === old.length
                    }
                    scope.$watch('items', function(now, old) {
                        var arr = now
                        var startIndex = 0
                        if (!contains(now, old)) {
                            cols.empty()
                            scope.wrappers = []
                        }else{
                            arr = now.slice(old.length)
                            startIndex = old.length
                        }
                        if(!arr || !arr.length)
                            return
                        scope.status.globalLoading = true
                        angular.forEach(arr,function(item,index){
                            var wrapper = $('<div class="pin"><a></a></div>')
                            wrapper.on('click',function(){
                                scope.$apply(function(){
                                    scope.currentPhotoIndex = startIndex+index 
                                    $(scope.modalTarget).modal()
                                })
                            })
                            loadImage(item[scope.srcName],function(img){
                                scope.$apply(function(){
                                    if (img.type === "error") {
                                        loadImage(errorImg,function(eimg){
                                            wrapper.append(eimg)
                                            scope.wrappers.push({dom:wrapper,index:index+startIndex,hide:true})
                                        },{maxWidth:width})
                                    } else {
                                        wrapper.append(img)
                                        scope.wrappers.push({dom:wrapper,index:index+startIndex,hide:true})
                                    }
                                })
                            },{maxWidth:width})
                        })
                    }, true)
                    var getCurrentWrapper = function(arr){
                        var min = -1
                        for(var i in arr){
                            if(arr[i].hide) {
                                min = i
                                break
                            }
                        }
                        if(min == -1) return false
                        for(var i in arr){
                            if(!arr[i].hide) continue
                            if(arr[i].index < arr[min].index) min = i
                        }
                        if(arr[min].dom){
                            arr[min].hide = false
                            console.log(arr[min].index,arr[min].dom)
                            return arr[min].dom
                        }
                        return false
                    }
                    var getWrapperCount = function(arr){
                        var count = 0
                        for(var i in arr){
                            if(arr[i].hide)
                                count++
                        }
                        return count
                    }
                    scope.$watch('wrappers.length',function(len){
                        if(!len || !scope.items || !scope.items.length || len!=scope.items.length)
                            return 
                        while(getWrapperCount(scope.wrappers)){
                            var dom = getCurrentWrapper(scope.wrappers)
                            if(dom) getMin(cols.toArray()).append(dom)
                        }
                        scope.status.globalLoading=false
                        

                    })


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