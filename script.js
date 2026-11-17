const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby-UKN1OZu8oLzA73D1DM6nTfCRuZ7tobhxbq7bOkYH1aQSKcXUBroWTq62pU448VZsrA/exec";

// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

document.getElementById("togglePassword")
.addEventListener("click", function() {

    const password = document.getElementById("password");

    const isPassword = password.type === "password";

    password.type = isPassword ? "text" : "password";

    this.textContent = isPassword ? "Hide" : "Show";

});

// ==========================================
// ADMIN LOGIN
// ==========================================

document.getElementById("loginForm")
.addEventListener("submit", async function(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const button =
        document.getElementById("loginButton");

    const buttonText =
        document.getElementById("buttonText");

    const message =
        document.getElementById("message");

    if (!GOOGLE_SCRIPT_URL.startsWith("https://script.google.com/")) {

        message.style.color = "#dc2626";
        message.textContent = "Please configure your Apps Script URL.";

        return;

    }

    button.disabled = true;
    buttonText.textContent = "VERIFYING...";

    message.style.color = "#829ab1";
    message.textContent = "Checking your credentials...";

    try {

        const response = await fetch(GOOGLE_SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify({

                action: "login",
                username: username,
                password: password

            })

        });

        const result = await response.json();

        if (result.success && result.token && result.dashboardUrl) {

            // Save temporary login session.
            sessionStorage.setItem(
                "adminToken",
                result.token
            );

            message.style.color = "#16a34a";
            message.textContent = "Login successful! Redirecting...";

            setTimeout(function() {

                window.location.href = result.dashboardUrl;

            }, 700);

        } else {

            message.style.color = "#dc2626";

            message.textContent =
                result.message || "Invalid username or password.";

        }

    } catch (error) {

        console.error(error);

        message.style.color = "#dc2626";

        message.textContent =
            "Connection failed. Check your Apps Script URL and deployment.";

    }

    button.disabled = false;
    buttonText.textContent = "LOGIN";

});