$(document).ready(function() {
    // load nav
    $.ajax({
        url: "nav.html",
        context: document.body,
        success: function(data){
            $(".mynav").html(data);
            $( $.mobile.navbar.prototype.options.initSelector, $(".mynav") ).navbar();
        }
    });
});

