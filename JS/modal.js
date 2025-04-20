// This JS file handle the about modal screen and the contact us modal screen, making sure they open and close correctly

document.addEventListener("DOMContentLoaded", function () {
    // === ABOUT MODAL ===
    const aboutModal = document.getElementById("aboutModal");
    const aboutOpenButtons = [
      document.getElementById("openAboutBtn"),
      document.getElementById("aboutButton")
    ];
    const aboutCloseButtons = document.querySelectorAll(".modal-close");
  
    aboutOpenButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          aboutModal.style.display = "block";
        });
      }
    });
  
    aboutCloseButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        aboutModal.style.display = "none";
      });
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === aboutModal) {
        aboutModal.style.display = "none";
      }
    });
  
    // === CONTACT MODAL ===
    const contactModal = document.getElementById("contactModal");
    const contactOpenButtons = [
      document.getElementById("contactLink"),
      document.getElementById("footerContactLink")
    ];
    const contactCloseButtons = document.querySelectorAll(".modal-close");
  
    contactOpenButtons.forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          contactModal.style.display = "block";
        });
      }
    });
  
    contactCloseButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        contactModal.style.display = "none";
      });
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === contactModal) {
        contactModal.style.display = "none";
      }
    });
  
    // === ESCAPE closes both ===
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        aboutModal.style.display = "none";
        contactModal.style.display = "none";
      }
    });
  });
  