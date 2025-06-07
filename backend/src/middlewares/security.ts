import { Request, Response, NextFunction } from 'express';

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Check for common injection patterns
  const body = JSON.stringify(req.body);
  const dangerousPatterns = [
    /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)/gi, // XSS
    /(union|select|insert|update|delete|drop|create|alter)\s/gi, // SQL injection
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(body)) {
      res.status(400).json({
        message: 'Invalid input detected'
      });
      return;
    }
  }
  next();
};

// CSRF protection middleware
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    next();
  }
  
  const token = req.headers['x-csrf-token'] || req.headers['csrf-token'];
  const expectedToken = req.headers['authorization']?.split(' ')[1]; // Use JWT as CSRF token
  
  if (!token || !expectedToken) {
    res.status(403).json({
      message: 'CSRF token missing'
    });
    return;
  }
  
  next();
};

// Secure headers middleware
export const secureHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
};