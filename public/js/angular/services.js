'use strict'

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('photowall.services', []).value('version', '0.1')
    .factory('Photo', ['$resource',
        function(resource) {
            return resource('/jphoto/:photoId', {
                photoId: '@id'
            })
        }
    ])
    .factory('GUID', [
        function() {
            function G() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
            }
            var guid = (G() + G() + G() + G() +
                G() + G() + G()).toLowerCase();
            return guid
        }
    ])
    .factory('PhotoScroll', ['$http',
        function(http) {
            var PhotoScroll = function() {
                this.items = []
                this.oldMax = 101 //cache max size,at most 100 big page can be cached in the this.old 
                this.old = []
                this.busy = false
                this.pageIndex = 0 // current,first is 1,not 0
                this.pageSize = 16
                this.pageCount = -1
                this.bigPageSize = 128 //must be int multiple of this.pageSize
                this.bigPageCount = -1
                this.bigPageIndex = 1 //first is 1 ,not 0
                this.full = false
            }
            PhotoScroll.prototype.selectBigPage = function(index) {
                if (this.busy) return
                this.busy = true

                this.bigPageIndex = index
                this.pageIndex = this.bigPageSize * (index - 1) / this.pageSize
                if (this.old.length > this.oldMax)
                    this.old = []
                if (!this.old[index] || !this.old[index].length) {
                    this.items = []
                    this.full = false
                } else {
                    this.items = this.old[index]
                    this.full = true
                }

                this.busy = false
            }
            PhotoScroll.prototype.nextPage = function() {
                if (this.busy || this.full) return
                this.busy = true

                this.pageIndex++
                var photoUrl = "/jphoto?pageIndex=" + this.pageIndex + '&pageSize=' + this.pageSize
                var photoCountUrl = '/jphoto/count'

                http.get(photoUrl).success(function(objs) {
                    for (var i = 0; i < objs.length; i++) {
                        this.items.push(objs[i])
                    }
                    http.get(photoCountUrl).success(function(data) {
                        this.pageCount = Math.ceil(data.count / this.pageSize)
                        this.bigPageCount = Math.ceil(data.count / this.bigPageSize)
                        if (this.pageIndex >= this.pageCount || this.pageIndex * this.pageSize >= this.bigPageSize) {
                            this.full = true
                            this.old[this.bigPageIndex] = this.items
                        }
                        this.busy = false
                    }.bind(this))
                }.bind(this))
            }

            return PhotoScroll
        }
    ])