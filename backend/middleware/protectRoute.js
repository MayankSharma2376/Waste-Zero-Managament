const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ error: "User not found" });
        }

        // Check if user is blocked
        if (req.user.isBlocked) {
            return res.status(403).json({ 
                error: "Account blocked", 
                isBlocked: true,
                blockReason: req.user.blockReason || "Your account has been suspended. Contact admin for more information.",
                blockedAt: req.user.blockedAt
            });
        }

        // Add both id and _id for compatibility
        req.user.id = req.user._id;
        
        next();
    } catch (error) {
        console.error("ProtectRoute error:", error.message);
        res.status(401).json({ error: "Not authorized" });
    }
};

module.exports = protectRoute;
