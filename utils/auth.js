const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// "enforce" (default) rejects requests without a valid token.
// "optional" lets them through and logs a warning. Use it only for a short
// rollout window while older clients (e.g. the mobile app) are updated.
const AUTH_MODE = (process.env.AUTH_MODE || "enforce").toLowerCase();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET is missing or too short. Set it to a random string of at least 32 characters."
    );
  }
  return secret;
};

// bcrypt hashes look like $2a$10$..., $2b$..., $2y$...
const isHashed = (value) =>
  typeof value === "string" && /^\$2[aby]\$\d{2}\$.{53}$/.test(value);

const hashPassword = (plain) => bcrypt.hash(String(plain), BCRYPT_ROUNDS);

// Returns { valid, needsUpgrade }. Accounts created before hashing was added
// still hold a plaintext password; those are compared directly once and the
// caller re-saves them as a hash.
const verifyPassword = async (plain, stored) => {
  if (typeof plain !== "string" || typeof stored !== "string" || !stored) {
    return { valid: false, needsUpgrade: false };
  }
  if (isHashed(stored)) {
    return { valid: await bcrypt.compare(plain, stored), needsUpgrade: false };
  }
  const valid = plain === stored;
  return { valid, needsUpgrade: valid };
};

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      fullname: user.fullname,
      userType: user.userType,
    },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );

// Requests that never need a token.
const PUBLIC_ROUTES = [{ method: "POST", path: /^\/api\/users\/login\/?$/i }];

const isPublic = (req) =>
  req.method === "OPTIONS" ||
  PUBLIC_ROUTES.some(
    (r) => r.method === req.method && r.path.test(req.originalUrl.split("?")[0])
  );

const authenticate = (req, res, next) => {
  if (isPublic(req)) return next();

  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme === "Bearer" && token) {
    try {
      const payload = jwt.verify(token, getJwtSecret());
      req.user = {
        id: payload.sub,
        fullname: payload.fullname,
        userType: payload.userType,
      };
      return next();
    } catch (err) {
      if (AUTH_MODE !== "optional") {
        const expired = err.name === "TokenExpiredError";
        return res.status(401).json({
          error: true,
          message: expired
            ? "Session expired, please log in again"
            : "Invalid authentication token",
        });
      }
    }
  }

  if (AUTH_MODE === "optional") {
    console.warn(
      `[auth] unauthenticated request allowed (AUTH_MODE=optional): ${req.method} ${req.originalUrl}`
    );
    return next();
  }
  return res
    .status(401)
    .json({ error: true, message: "Authentication required" });
};

module.exports = {
  authenticate,
  hashPassword,
  verifyPassword,
  isHashed,
  signToken,
  getJwtSecret,
  AUTH_MODE,
};
