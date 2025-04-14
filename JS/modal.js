$(document).ready(function() {
    // open the about screen
    $("#openAboutBtn").click(function() {
        $("#aboutModal").css("display", "block");
    });
    
    // close when user click on X
    $(".about-close").click(function() {
        $("#aboutModal").css("display", "none");
    });
    
    // close when user press outside of the about screen
    $(window).click(function(event) {
        if ($(event.target).is("#aboutModal")) {
            $("#aboutModal").css("display", "none");
        }
    });
    
    // close when user press ESC
    $(document).keydown(function(event) {
        if (event.keyCode == 27) {
            $("#aboutModal").css("display", "none");
        }
    });
});