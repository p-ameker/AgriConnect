document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let errorMsg = document.getElementById("error-msg");

    if (password.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters.";
        return;
    }

    if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match.";
        return;
    }

    errorMsg.textContent = "";
    alert("Sign Up Successful!");
    // Here you could send data to backend
});
