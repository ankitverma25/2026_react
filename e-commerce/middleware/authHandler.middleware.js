import jwt from "jsonwebtoken";

const authHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer ")) {
      const error = new Error("token is invalid");
      error.status = 401;
      throw error
    }
    console.log(authToken);

    const token = authToken.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } 
  catch (error) {
    error.status = 401;
    error.message = "invalid token or expired";
    next(error);
  }
};

export default authHandler;
