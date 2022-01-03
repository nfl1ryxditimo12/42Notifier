<img width="600" alt="42alert" src="https://user-images.githubusercontent.com/74334399/147906064-dd87f8e4-7577-4a0a-98ae-bd34d242d8a9.png">

<br/>

📨 새로운 Agenda 이벤트를 슬랙으로 보내드려요 <br/>

`Heroku` 와 `Node.js` 를 이용한 토이 프로젝트 입니다.

<br/>

👉 [42Alert 프로젝트 개발기](https://seongsu.me/42alert-retrospective) 👈

<br/>

## 😎 Quick Start

### 1. 프로젝트 시작

```SHELL
# yarn으로 시작해 주세요
$ yarn install
또는
$ yarn
```

> 만약 `yarn`을 사용하고 있지 않다면, 설치를 진행해 주세요

```SHELL
$ npm install --global yarn
```

<br/>

### 2. 환경변수 설정을 해주세요

첨부돼 있는 `.env.sample`파일을 참고해 `.env.dev`파일을 작성해 주세요.<br/>
- `SLACK_TOKEN`에는 슬랙 봇의 OAuth Token을 넣어야 합니다.<br/>
- `SLACK_CHENNAL`에는 원하는 워크스페이스 안의 채널 이름을 적어주시면 됩니다.

<br/>

### 3. 이제 원하는 슬랙 워크스페이스에서 알림 서비스를 받아 볼 수 있습니다.

```SHELL
# yarn start는 production 환경에서 사용합니다.
$ yarn dev
```

> 이전에 꼭 Slack Bot OAuth Token을 발급 받고 사용해야 합니다.<br/>
> [쉽고 간단한 Slack Bot 만들기](https://seongsu.me/slack-bot)

<br/>

👉 헤로쿠가 아닌 다른 서버에 배포할 땐 `src/modules/env.ts` 파일에 배포용 설정을 따로 해야합니다

<br/>

## 🤖 봇 구성

<br/>

![42Alert_FlowChart](https://user-images.githubusercontent.com/74334399/137498343-f9153426-2ce0-43a8-ac3f-35046ddf51af.png)

<br/>

## 🚀 개발 환경

-   Node.js v16.13.1 (LTS)
-   yarn v1.22.17
-   TypeScript v4.5.4
-   Typeorm v0.2.41
-   Heroku CLI v7.59.2
