module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Check if env var is set (don't show the actual value for security)
  const hasKey = !!process.env.BRANKAS_SECRET_KEY;
  
  res.status(200).json({
    status: 'ok',
    envVarSet: hasKey,
    message: hasKey ? 'BRANKAS_SECRET_KEY is configured' : 'BRANKAS_SECRET_KEY is NOT set',
    nodeVersion: process.version,
  });
};
