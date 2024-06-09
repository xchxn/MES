import { Apps } from 'pm2';

const apps: Apps[] = [
  {
    name: 'nextjs-app',
    script: 'node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000, // 필요한 경우 포트를 수정하세요
    },
  },
];

export = { apps };
