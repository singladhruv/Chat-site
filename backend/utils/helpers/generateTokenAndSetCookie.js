import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, "dhruvloveseveryone", {
    expiresIn: "15d", // Token expiration time
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "None",
    // Helps prevent XSS attacks
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    secure: true,
  });

  return token;
};

export default generateTokenAndSetCookie;
