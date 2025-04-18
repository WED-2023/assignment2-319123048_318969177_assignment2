document.addEventListener("DOMContentLoaded", function () {
    // show about popup
    document.getElementById("openAboutBtn").addEventListener("click", function () {
        document.getElementById("aboutModal").style.display = "block";
    });

    // close when clicking X
    document.querySelectorAll(".about-close").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.getElementById("aboutModal").style.display = "none";
        });
    });

    // close when clicking background
    window.addEventListener("click", function (event) {
        if (event.target.id === "aboutModal") {
            document.getElementById("aboutModal").style.display = "none";
        }
    });

    // close with escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.getElementById("aboutModal").style.display = "none";
        }
    });
});