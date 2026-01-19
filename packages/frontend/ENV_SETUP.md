# Frontend Environment Setup

## Environment Variables

The frontend requires a `.env.local` file in the `packages/frontend/` directory.

### Required Variables

1. **Database Configuration:**
   - `DB_HOST` - Database host (e.g., localhost)
   - `DB_USER` - Database username
   - `DB_PASSWORD` - Database password
   - `DB_NAME` - Database name
   - `DB_PORT` - Database port (default: 3306)

2. **Node Environment:**
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
   
   NODE_ENV=development
   ```

3. **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Notes

- The frontend and backend can use the same database, but they have separate environment files
- This allows you to configure different settings for each package if needed
- In production, you may want different database credentials or connection settings
