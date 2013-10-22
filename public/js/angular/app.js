'use strict'


// Declare app level module which depends on filters, and services
angular.module('photowall', ['photowall.filters', 'photowall.services', 'photowall.directives', 'photowall.controllers', 'ngResource', 'infinite-scroll',"angularFileUpload"])
// .
// config(
//   ['$routeProvider', function($routeProvider) {
//   $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'})
//   $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'})
//   $routeProvider.otherwise({redirectTo: '/view1'})
// }]
// )
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
