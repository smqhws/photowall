$(function() {
    $('#navbar').find('.active').removeClass('active')
    $('#navbar').children('ul').children('li').each(function() {
        var self = $(this)
        $(this).find('a').each(function() {
            if (window.location.pathname.indexOf($(this).attr('href'))===0)
                self.addClass('active')
        })
    })
})