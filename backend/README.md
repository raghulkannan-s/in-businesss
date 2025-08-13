# In-Business API Backend

A TypeScript-based REST API built with Express.js and Prisma ORM for user management, product catalog, scoring system, and team collaboration.

## 🚀 Features

- **Authentication**: JWT-based auth with refresh tokens
- **User Management**: User profiles and role-based access
- **Product Catalog**: Product CRUD with inventory tracking
- **Scoring System**: Score tracking and leaderboards
- **Team Management**: Team creation and management
- **File Upload**: Screenshot upload handling
- **Admin Panel**: Administrative controls
- **Eligibility System**: User eligibility validation
- **Logging**: System audit logging

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Upload**: Multer middleware
- **Security**: bcrypt password hashing

## 📁 Project Structure

```text
backend/
├── .env                      # Environment variables (not in repo)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── README.md                # This documentation
├── generated/               # Auto-generated Prisma files
│   └── prisma/             # Prisma client artifacts
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Database schema definition
│   └── migrations/         # Database migration history
├── public/                  # Static files
│   └── index.html          # API landing page
├── src/                     # Application source code
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Application entry point
│   ├── controllers/        # Request handlers
│   │   ├── adminController.ts       # Admin operations
│   │   ├── authController.ts        # Authentication logic
│   │   ├── eligibilityController.ts # Eligibility checks
│   │   ├── logsController.ts        # Logging operations
│   │   ├── matchController.ts       # Match/game logic
│   │   ├── playerController.ts      # Player management
│   │   ├── productController.ts     # Product operations
│   │   ├── scoreController.ts       # Scoring system
│   │   ├── screenshotController.ts  # File upload handling
│   │   ├── teamController.ts        # Team management
│   │   └── userController.ts        # User management
│   ├── database/           # Database configuration
│   │   └── db.ts           # Prisma client setup
│   ├── lib/                # Utility libraries
│   │   ├── hash.ts         # Password hashing utilities
│   │   └── jwt.ts          # JWT token utilities
│   ├── middlewares/        # Custom middleware
│   │   ├── authMiddleware.ts        # JWT authentication
│   │   ├── eligibilityCheck.ts     # Eligibility validation
│   │   ├── roleMiddleware.ts        # Role-based access control
│   │   └── uploadMiddleware.ts      # File upload handling
│   ├── models/             # Data models
│   │   └── log.model.ts    # Logging model definitions
│   ├── routes/             # API route definitions
│   │   ├── adminRouter.ts          # Admin routes
│   │   ├── authRouter.ts           # Authentication routes
│   │   ├── logsRouter.ts           # Logging routes
│   │   ├── matchRouter.ts          # Match routes
│   │   ├── productRouter.ts        # Product routes
│   │   ├── scoreRouter.ts          # Score routes
│   │   ├── teamRouter.ts           # Team routes
│   │   ├── uploadRouter.ts         # File upload routes
│   │   └── userRouter.ts           # User routes
│   └── utils/              # Utility functions (currently empty)
└── uploads/                # File upload storage
    └── screenshots/        # Screenshot storage directory
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-refresh-token-secret"
   PORT=5000
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate deploy
   
   # Optional: Seed database
   npx prisma db seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Scores
- `GET /api/scores` - Get all scores
- `POST /api/scores` - Submit new score
- `GET /api/scores/leaderboard` - Get leaderboard
- `GET /api/scores/user/:id` - Get user scores

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/join` - Join team

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - Manage users
- `GET /api/admin/logs` - System logs
- `POST /api/admin/config` - Update configuration

### File Upload
- `POST /api/upload/screenshot` - Upload screenshot
- `GET /api/uploads/:filename` - Serve uploaded files

## 🔐 Authentication & Authorization

The API uses JWT-based authentication with the following flow:

1. **Registration/Login**: User provides credentials
2. **Token Generation**: Server returns access + refresh tokens
3. **Request Authentication**: Include `Authorization: Bearer <token>` header
4. **Token Refresh**: Use refresh token to get new access token

### Roles
- **USER**: Basic user permissions
- **ADMIN**: Full system access
- **MODERATOR**: Limited admin permissions

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and profiles
- **Product**: Product catalog and inventory
- **Score**: Scoring and leaderboard data
- **Team**: Team management and collaboration
- **RefreshToken**: Secure token management
- **Log**: Audit logging and monitoring

## 🚀 Deployment

### Environment Variables
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3000
NODE_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Configure production database
- [ ] Set secure JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Configure file upload limits
- [ ] Set up backup strategies

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Code Style
- TypeScript with strict mode
- ESLint and Prettier configuration
- Conventional commits
- API-first design approach

## 📊 Monitoring & Logging

The application includes comprehensive logging:

- **Request Logging**: All API requests and responses
- **Error Logging**: Detailed error tracking
- **Audit Logging**: User actions and system changes
- **Performance Monitoring**: Response times and resource usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/` endpoint

## 🔄 Version History

- **v1.0.0**: Initial release with core features
- **v1.1.0**: Added team management
- **v1.2.0**: Enhanced scoring system
- **v1.3.0**: Admin panel improvements

---

**Built with ❤️ for modern business applications**