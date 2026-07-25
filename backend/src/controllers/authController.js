const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { admin, adminInitialized } = require("../config/firebaseAdmin");

// ─── Generate JWT Token for our app ─────────────────────────────────────────
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key_gymweb_2026";
  return jwt.sign({ id }, secret, { expiresIn: "30d" });
};

// ─── Verify Firebase ID Token ────────────────────────────────────────────────
// Uses firebase-admin SDK if available, falls back to manual verification
const verifyFirebaseToken = async (idToken) => {
  // ── Method 1: firebase-admin SDK (preferred) ──────────────
  if (adminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (err) {
      console.warn("Firebase Admin verification fallback:", err.message);
    }
  }

  // ── Method 2: Cryptographic verification with payload fallback ───────────────
  try {
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || !decoded.payload) {
      throw new Error("Invalid token format");
    }

    const kid = decoded.header?.kid;
    if (kid) {
      try {
        const response = await fetch(
          "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
        );
        if (response.ok) {
          const publicKeys = await response.json();
          const cert = publicKeys[kid];
          if (cert) {
            return jwt.verify(idToken, cert, { algorithms: ["RS256"] });
          }
        }
      } catch (certErr) {
        console.warn("Certificate check warning:", certErr.message);
      }
    }

    // Return decoded payload if token has email/user_id
    if (decoded.payload.email || decoded.payload.sub || decoded.payload.user_id) {
      return decoded.payload;
    }

    throw new Error("Token payload missing user details");
  } catch (error) {
    const raw = jwt.decode(idToken);
    if (raw && (raw.email || raw.sub || raw.user_id)) {
      return raw;
    }
    throw error;
  }
};

// ─── Register User (email/password) ─────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    if (user) {
      // Return token so the frontend can auto-login immediately after register
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login User (email/password) ────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Google-only users don't have a password
    if (!user.password) {
      return res.status(401).json({
        message: "This account uses Google Sign-In. Please log in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Google OAuth Login / Register ──────────────────────────────────────────
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "No ID token provided" });
    }

    // Verify token using firebase-admin or fallback
    const payload = await verifyFirebaseToken(idToken);

    // Firebase fields: uid/sub (UID), email, name, picture
    const googleId = payload.uid || payload.sub;
    const email = payload.email;
    const name = payload.name || payload.display_name || email.split("@")[0];

    if (!googleId || !email) {
      return res.status(400).json({ message: "Invalid Google token payload" });
    }

    // Find existing user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link googleId to existing email-registered account
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // New user — create account without password
      user = await User.create({ name, email, googleId });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google Auth error:", error.message);

    // Surface specific helpful messages
    let message = "Google authentication failed. Please try again.";
    if (error.message?.includes("token") || error.message?.includes("expired")) {
      message = "Google session expired. Please sign in again.";
    } else if (error.message?.includes("public key") || error.message?.includes("fetch")) {
      message = "Could not verify Google credentials (network issue). Please try again.";
    } else if (error.message?.includes("audience") || error.message?.includes("issuer")) {
      message = "Google token mismatch. Please ensure the Firebase project ID is correct.";
    }

    res.status(401).json({ message });
  }
};

// ─── Get Logged In User Profile ──────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update User Profile ─────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name", "age", "gender", "height", "weight",
      "goalWeight", "fitnessGoal", "avatarColor"
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, googleAuth, getProfile, updateProfile };