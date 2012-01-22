$(window).load(function() {
    // load nav
    $.ajax({
        url: "nav.html",
        context: document.body,
        success: function(data){
            $(".mynav").html(data);
            $("#mobile").attr('src', 'js/jquery.mobile.js');
        }
    });
});

