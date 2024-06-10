const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT token
const jwtAuthMiddleware = (req, res, next) => {
  // Check if the request headers have authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ error: "Token not found" });
  }

  // Extract the JWT token from the request headers
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request object
    req.userPayload = decoded;
    // userPayload can be user_id, username, etc.
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Function to generate JWT token
const generateToken = (userData) => {
  // userData is generally a payload or information of data
  // userData is just a variable name we can change it

  // Generate a new JWT token using user data
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30m' });
};

module.exports = { jwtAuthMiddleware, generateToken };
