document.addEventListener("DOMContentLoaded", function () {
    // open the about screen
    document.getElementById("openAboutBtn").addEventListener("click", function () {
        document.getElementById("aboutModal").style.display = "block";
    });

    // close when user clicks on X
    document.querySelectorAll(".about-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.getElementById("aboutModal").style.display = "none";
        });
    });

    // close when user clicks outside the modal
    window.addEventListener("click", function (event) {
        if (event.target.id === "aboutModal") {
            document.getElementById("aboutModal").style.display = "none";
        }
    });

    // close when user presses ESC
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.getElementById("aboutModal").style.display = "none";
        }
    });
});
