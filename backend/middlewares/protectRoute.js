import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Retrieve token from cookies
    const token = req.cookies.jwt;

    // Check if token is not available
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token provided, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, "dhruvloveseveryone");

    // Find the user by ID and exclude the password from the result
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ error: "User not found, authorization denied" });
    }

    // Attach the user to the request object for use in protected routes
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Token expired, please login again" });
    } else if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ error: "Invalid token, authorization denied" });
    } else {
      console.log("Error in protectRoute: ", err.message);
      return res.status(500).json({ error: "Server error: " + err.message });
    }
  }
};

export default protectRoute;
