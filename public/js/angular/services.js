'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('photowall.services', []).value('version', '0.1')
    .factory('Photo', ['$http',
        function(http) {
            var Photo = function() {
                this.items = [];
                this.old  = [];
                this.busy = false;
                this.pageIndex = 0;// current,first is 1,not 0
                this.pageSize = 4;
                this.pageCount = -1;
                this.bigPageSize = 4;
                this.bigPageCount = -1;
                this.bigPageIndex = 1;//first is 1 ,not 0
                this.pinNum=0;
                this.full = false;
            };
            Photo.prototype.selectBigPage = function(index){
                this.bigPageIndex = index
                this.busy = false
                this.pinNum=0;
                this.pageIndex = this.bigPageSize *(index-1)/this.pageSize
                if(!this.old[index] || !this.old[index].length){
                    this.items=[]
                    this.full = false
                }
                else{
                    this.items= this.old[index]
                    this.full = true
                }
                console.log(JSON.stringify(this))

            }
            Photo.prototype.nextPage = function() {
                if (this.busy || this.full) return;
                this.busy = true;

                this.pageIndex ++
                var url = "/json?pageIndex=" + this.pageIndex + '&pageSize=' + this.pageSize;
                http.get(url).success(function(data) {
                    var items = data.objs
                    for (var i = 0; i < items.length; i++) {
                        this.items.push(items[i])
                    }
                    this.pageIndex = parseInt( data.pageIndex)
                    this.pageSize = parseInt(data.pageSize)
                    this.pageCount = parseInt(data.pageCount)
                    this.bigPageCount = Math.ceil(this.pageCount * this.pageSize / this.bigPageSize)
                    if (this.pageIndex >= this.pageCount
                        || this.pageIndex * this.pageSize >= this.bigPageSize) {
                        this.full = true
                        this.old[this.bigPageIndex] = this.items
                    }
                    this.busy = false;
                }.bind(this));
            };

            return Photo;
        }
    ])