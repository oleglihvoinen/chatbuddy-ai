let lastCall = 0;
export default function simpleRateLimit(ms = 750) {
  return (req, res, next) => {
    const now = Date.now();
    if (now - lastCall < ms) return res.status(429).json({ message: 'Too many requests' });
    lastCall = now;
    next();
  };
}
