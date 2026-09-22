const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, name, otp) => {
  await transporter.sendMail({
    from: `"E-Learn Authentication" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Email Verification OTP",
    text: `Hello ${name}, your verification OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto;">
        <h2 style="color: #2563eb;">Email Verification</h2>

        <p>Hello <strong>${name}</strong>,</p>

        <p>Your email verification OTP is:</p>

        <div style="
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          padding: 20px;
          text-align: center;
          border-radius: 10px;
        ">
          ${otp}
        </div>

        <p>This OTP will expire in 10 minutes.</p>
        <p>Do not share this OTP with anyone.</p>
      </div>
    `
  });
};

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters"
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: cleanEmail });

    if (user && user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP valid for 10 minutes
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (user && !user.isVerified) {
      user.name = name.trim();
      user.password = hashedPassword;
      user.otpHash = otpHash;
      user.otpExpiresAt = otpExpiresAt;

      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        otpHash,
        otpExpiresAt
      });
    }

    try {
      await sendOTPEmail(user.email, user.name, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);

      return res.status(500).json({
        success: false,
        message: "Registration saved, but OTP email could not be sent"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
      email: user.email
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP."
      });
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP."
      });
    }

    const otpMatched = await bcrypt.compare(
      otp.toString(),
      user.otpHash
    );

    if (!otpMatched) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login."
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
});

// RESEND OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    const otp = generateOTP();

    user.otpHash = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    await sendOTPEmail(user.email, user.name, otp);

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully"
    });
  } catch (error) {
    console.error("Resend OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not resend OTP. Check Gmail settings."
    });
  }
});

// LOGIN USER AND ADMIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email using OTP first"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role:user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

module.exports = router;