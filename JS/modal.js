// modal.js
// About modal functionality

$(document).ready(function() {
    // open the about screen
    $("#openAboutBtn").click(function() {
        $("#aboutModal").css("display", "block");
    });
    
    // closing it with the X button
    $(".about-close").click(function() {
        $("#aboutModal").css("display", "none");
    });
    
    // closing it with clicking on anything outside of it
    $(window).click(function(event) {
        if ($(event.target).is("#aboutModal")) {
            $("#aboutModal").css("display", "none");
        }
    });
    
    // closing by clicking on ESC
    $(document).keydown(function(event) {
        if (event.keyCode == 27) { // ESC button in ASCII
            $("#aboutModal").css("display", "none");
        }
    });
});