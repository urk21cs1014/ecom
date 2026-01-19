module.exports = {
  apps: [
    // Production (recommended): build first, then start with `npm start` which runs `next start`
    {
      name: 'ecom-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 2002,
      },
      restart_delay: 1000,
      max_restarts: 5,
    },
    {
      name: 'ecom-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        BACKEND_URL: 'http://localhost:2002',
      },
      restart_delay: 1000,
      max_restarts: 5,
    },

    // Optional: development mode entries (use if you want pm2 to manage `next dev` processes)
    // NOTE: running Next.js dev under pm2 is uncommon — it works but will keep watch/compile processes running.
    {
      name: 'ecom-backend-dev',
      cwd: './backend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
      autorestart: false, // avoid flapping during local edits
    },
    {
      name: 'ecom-frontend-dev',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
      },
      autorestart: false,
    },
  ],
};
