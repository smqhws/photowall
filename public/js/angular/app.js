'use strict'


// Declare app level module which depends on filters, and services
angular.module('photowall', ['ngRoute','photowall.filters', 'photowall.services', 'photowall.directives', 'photowall.controllers', 'ngResource', 'infinite-scroll', "angularFileUpload"])
    .
config(
    ['$routeProvider',
        function($routeProvider) {
            $routeProvider
            .when('/',{
                templateUrl:'/html/photo/list.html',
                controller:'PhotoListCtrl'
            })
            $routeProvider.otherwise({
                redirectTo: '404.html'
            })
        }
    ]
)
.config(['$httpProvider','$compileProvider', function ($httpProvider,$compileProvider) {
    var elementsList = $()
    var clearMessage = function(){
        elementsList.each(function(){
            $(this).html('')
        })
    }
    var showMessage = function(content, time) {
        elementsList.each(function(){
            $('<div class="alert alert-danger alert-dismissable col-md-12"></div>')
                .hide()
                .fadeIn('fast')
                .delay(time)
                .fadeOut('fast', function() { $(this).remove(); })
                .appendTo($(this))
                .text(content)
                .prepend($('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'))
        })
        // $('<div class="alert alert-danger alert-dismissable"></div>')
        //     .hide()
        //     .fadeIn('fast')
        //     .delay(time)
        //     .fadeOut('fast', function() { $(this).remove(); })
        //     .appendTo(elementsList)
        //     .text(content)
        //     .prepend($('<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'))
    }
    var $http,
        interceptor = ['$q', '$injector', function ($q, $injector) {

            function success(response) {
                return response
            }

            function error(errorResponse) {
                
                clearMessage()
                var msg = errorResponse.data.error ? (errorResponse.data.error.message ? errorResponse.data.error.message: errorResponse.data.error) : errorResponse.data
                showMessage(msg,6000)
                return $q.reject(errorResponse)
            }

            return function (promise) {
                return promise.then(success, error)
            }
        }]

    $httpProvider.responseInterceptors.push(interceptor)
    $compileProvider.directive('httpErrorMessages', function() {
        return {
            link: function(scope, element, attrs) {
                elementsList.push($(element))
            }
        }
    })
}])
// .constant('_START_REQUEST_', '_START_REQUEST_')
//     .constant('_END_REQUEST_', '_END_REQUEST_')
//     .config(['$httpProvider', '_START_REQUEST_', '_END_REQUEST_',
//         function($httpProvider, _START_REQUEST_, _END_REQUEST_) {
//             var $http,
//                 interceptor = ['$q', '$injector',
//                     function($q, $injector) {
//                         var rootScope

//                         function success(response) {
//                             // get $http via $injector because of circular dependency problem
//                             $http = $http || $injector.get('$http')
//                             // don't send notification until all requests are complete
//                             if ($http.pendingRequests.length < 1) {
//                                 // get $rootScope via $injector because of circular dependency problem
//                                 rootScope = rootScope || $injector.get('$rootScope')
//                                 // send a notification requests are complete
//                                 rootScope.$broadcast(_END_REQUEST_)
//                             }
//                             return response
//                         }

//                         function error(response) {
//                             // get $http via $injector because of circular dependency problem
//                             $http = $http || $injector.get('$http')
//                             // don't send notification until all requests are complete
//                             if ($http.pendingRequests.length < 1) {
//                                 // get $rootScope via $injector because of circular dependency problem
//                                 rootScope = rootScope || $injector.get('$rootScope')
//                                 // send a notification requests are complete
//                                 rootScope.$broadcast(_END_REQUEST_)
//                             }
//                             return $q.reject(response)
//                         }

//                         return function(promise) {
//                             // get $rootScope via $injector because of circular dependency problem
//                             rootScope = rootScope || $injector.get('$rootScope')
//                             // send notification a request has started
//                             rootScope.$broadcast(_START_REQUEST_)
//                             return promise.then(success, error)
//                         }
//                     }
//                 ]

//             $httpProvider.responseInterceptors.push(interceptor)
//         }
//     ])