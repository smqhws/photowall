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
// .directive('masonry', [
//     function() {
//         return function(scope, elm, attrs) {
//             scope.$watch(function() {
//                 alert(elm.find('.item').length)
//                 return elm.find('.item').length
//             }, function() {
//                 elm.masonry({
//                     columnWidth: 200,
//                     itemSelector: '.item'
//                 })
//             })
//         }
//     }
// ])