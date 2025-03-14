// Disable right-click on the iframe to prevent downloads
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('contextmenu', function (e) {
        e.preventDefault();  // This stops the right-click menu from appearing
    });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();  // Prevent default anchor behavior
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'  // Smooth scroll to the target element
        });
    });
});

(function() {
    emailjs.init("-G5FtqRfwp9pmgp_RT"); // Updated with your actual EmailJS Public Key
})();

document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    emailjs.send("service_48i9e8l", "template_q2ujs8t", {
        name: name,
        email: email,
        message: message
    }).then(response => {
        alert("Message sent successfully!");
    }).catch(error => {
        alert("Error sending message. Please try again.");
        console.error(error);
    });
});