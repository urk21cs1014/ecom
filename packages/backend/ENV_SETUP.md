# Backend Environment Setup

## Environment Variables

The backend requires a `.env.local` file in the `packages/backend/` directory.

### Required Variables

1. **Database Configuration:**
   - `DB_HOST` - Database host (e.g., localhost)
   - `DB_USER` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_NAME` - Database name
   - `DB_PORT` - Database port (default: 3306)

2. **Admin Authentication:**
   - `ADMIN_USERNAME` - Admin login username (default: admin)
   - `ADMIN_PASSWORD` - Admin login password (default: admin123)

3. **Node Environment:**
   - `NODE_ENV` - Set to `development` or `production`

## Setup Instructions

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in your actual values:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   DB_PORT=3306
   
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   
   NODE_ENV=development
   ```

3. **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Security Notes

- In production, use strong passwords for `ADMIN_PASSWORD`
- Consider using environment-specific values for production
- Keep your `.env.local` file secure and never share it publicly
