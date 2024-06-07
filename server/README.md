# Backend Guide
### Using Stack
<div align=center>
<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">
<img src="https://img.shields.io/badge/amazonecs-FF9900?style=for-the-badge&logo=amazonecs&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
<img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
<img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=white">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white">
<img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">
</div>

### Service Wiki
- Swagger docs ver.
  - /api/docs
- To Notion ver.
  - 


# To Start
## 0. Need Environment
- Node.js v20.11.1
- <img src="https://img.shields.io/npm/v/npm.svg?logo=npm">

<a src=https://nodejs.org/en/download/prebuilt-installer>Click to Install Node.js</a>

## 1. Set Environment
- Install package.json dependency collectively.
```bash
cd server
npm install
```
## 2. Generate Firebase Private Key 
- Go to firebase console - project setting - Service accounts - Firebase Admin SDK - Generate New Private Key
- And locate root folder
  - /server/example-private-key.json
- Last, Add a filename to .gitignore
## 3. Setting .env
```env
NAVER_CLIENT_ID=Naver-api-application-Client ID
NAVER_CLIENT_SECRET=Naver-api-application-Client-Secret
FIREBASE_SERVICE_ACCOUNT_PATH=./example-private-key.json
FIREBASE_DATABASE_URL=example.firebaseio.com
KAKAO_CLIENT_ID=kakao-application-id
JWT_SECRET=
```
- And location .env for root folder
  - /server/.env
## 4. If you want start server in local
```bash
npm run start
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
