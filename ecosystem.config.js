module.exports = {
  apps: [
    {
      name: 'Friend-connection',
      script: 'dist/src/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      watch_options: {
        followSymlinks: false,
        ignored: ['src/storage', 'dist/src/storage'],
      },
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
