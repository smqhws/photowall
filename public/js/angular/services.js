'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('photowall.services', []).value('version', '0.1')
    .factory('Photo', ['$http',
        function(http) {
            var Photo = function() {
                this.items = [];
                this.busy = false;
                this.pageIndex = 0;
                this.pageSize = 20;
                this.pageCount = -1;
                this.full = false;
            };

            Photo.prototype.nextPage = function() {
                if (this.busy) return;
                this.busy = true;

                this.pageIndex += 1
                var url = "/json?pageIndex=" + this.pageIndex + '&pageSize=' + this.pageSize;
                http.get(url).success(function(data) {
                    var items = data.objs
                    for (var i = 0; i < items.length; i++) {
                        this.items.push(items[i]);
                    }
                    this.pageIndex = data.pageIndex
                    this.pageSize = data.pageSize
                    this.pageCount = data.pageCount
                    if(parseInt(this.pageIndex)>=parseInt(this.pageCount))
                        this.full = true
                    this.busy = false;
                }.bind(this));
            };

            return Photo;
        }
    ])