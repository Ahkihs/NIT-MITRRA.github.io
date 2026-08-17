document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".input");
    const form = document.getElementById("doubtForm");
    const emailInput = document.getElementById("userEmail");
    const nameInput = document.getElementById("userName");

    function focusFunc() {
        let parent = this.closest(".input-container");
        if (parent) parent.classList.add("focus");
    }

    function blurFunc() {
        let parent = this.closest(".input-container");
        if (parent && this.value.trim() === "") {
            parent.classList.remove("focus");
        }
    }

    inputs.forEach((input) => {
        input.addEventListener("focus", focusFunc);
        input.addEventListener("blur", blurFunc);
    });

    // Strict email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailInput) {
        emailInput.addEventListener("input", function () {
            const val = this.value.trim();
            if (val && !emailRegex.test(val)) {
                this.setCustomValidity("Please enter a valid email address (e.g. name@example.com)");
            } else {
                this.setCustomValidity("");
            }
        });
    }

    // Form submission validation
    if (form) {
        form.addEventListener("submit", function (e) {
            // Validate Name
            if (nameInput && nameInput.value.trim().length < 2) {
                nameInput.setCustomValidity("Please enter your full name (at least 2 characters).");
                nameInput.reportValidity();
                e.preventDefault();
                return;
            } else if (nameInput) {
                nameInput.setCustomValidity("");
            }

            // Validate Email
            if (emailInput) {
                const emailVal = emailInput.value.trim();
                if (!emailRegex.test(emailVal)) {
                    emailInput.setCustomValidity("Please enter a valid email address (e.g. name@example.com)");
                    emailInput.reportValidity();
                    e.preventDefault();
                    return;
                } else {
                    emailInput.setCustomValidity("");
                }
            }
        });
    }
});
