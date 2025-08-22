// server.js
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files (CSS, images, JS)

// Session setup
app.use(session({
    secret: "greenfields-secret",
    resave: false,
    saveUninitialized: true
}));

// In-memory user database (replace with a real DB later)
let users = [
    {
        email: "test@example.com",
        passwordHash: bcrypt.hashSync("password123", 10) // Example user
    }
];

// Serve login page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

// Serve signup page
app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

// Handle Signup
app.post("/signup_process.php", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        return res.send("⚠️ All fields are required. <a href='/signup'>Try again</a>");
    }

    if (password !== confirmPassword) {
        return res.send("⚠️ Passwords do not match. <a href='/signup'>Try again</a>");
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.send("⚠️ Email already registered. <a href='/'>Login</a>");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    users.push({ email, passwordHash });

    res.send(`✅ Signup successful! <a href='/'>Login here</a>`);
});

// Handle Login
app.post("/login_process.php", async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.send("❌ User not found. <a href='/'>Try again</a>");
    }

    // Compare password
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
        return res.send("❌ Incorrect password. <a href='/'>Try again</a>");
    }

    // Set session
    req.session.user = { email: user.email };
    res.redirect("/dashboard");
});

// Dashboard (protected route)
app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/");
    }
    res.send(`🌿 Hello, ${req.session.user.email}! <a href='/logout'>Logout</a>`);
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
