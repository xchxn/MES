module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000 // 필요한 경우 포트를 수정하세요
      }
    }
  ]
};
