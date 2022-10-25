<img width="600" alt="42alert" src="https://user-images.githubusercontent.com/74334399/147906064-dd87f8e4-7577-4a0a-98ae-bd34d242d8a9.png">

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/yarn-2C8EBB?style=flat-square&logo=Yarn&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Mysql-4479A1?style=flat-square&logo=Mysql&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/aws-232F3E?style=flat-square&logo=Amazon AWS&logoColor=white">&nbsp
</p>

<br/>

<img width="598" alt="스크린샷 2022-10-22 오후 5 47 50" src="https://user-images.githubusercontent.com/74334399/197679699-2b703ff7-01c6-45d2-9cf7-1f052936fc3d.png">

<br/>

📨 새로운 Agenda 이벤트를 슬랙으로 보내드려요 <br/>

`Heroku` 와 `Node.js` 를 이용한 토이 프로젝트 입니다.

<br/>

👉 [42Alert 프로젝트 개발기](https://seongsu.me/42alert-retrospective) 👈

<br/>

## 📝 수정 사항

```SHELL
# 2022-10-07 수정 내역

- Event, Exam 이벤트 프로세스 분산
- 에러 도메인 별 로깅 로직 추가
- 에러 또는 Latency 대응을 위한 모니터링 로직 추가
- Fatal Error 발생 시 모니터링용 슬랙 채널 알림 로직 추가
- 서버 Seoul -> Paris 이전


# 2022-05-11 수정 내역

- 헤로쿠 보안 문제로 인해 AWS EC2로 서버 이전
- API 파싱 5초 -> 3초
- `Event`, `Exam` 이모티콘 삭제
```

<br/>

## 📭 기존 채널에서 받아보기

따로 워크스페이스를 만들지 않아도 사용 가능합니다<br/>
Born2code 워크스페이스의 #42seoul_tools_agenda-notifier 채널 등록!<br/>

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
# yarn start:prod는 production 환경에서 사용합니다.
$ yarn start:dev
```

> 이전에 꼭 Slack Bot OAuth Token을 발급 받고 사용해야 합니다.<br/>
> [쉽고 간단한 Slack Bot 만들기](https://seongsu.me/slack-bot)

<br/>

👉 EC2가 아닌 다른 서버에 배포할 땐 `src/modules/env.ts` 파일에 배포용 설정을 따로 해야합니다

<br/>

## 🤖 봇 구성

<br/>

![42Alert_FlowChart](https://user-images.githubusercontent.com/74334399/137498343-f9153426-2ce0-43a8-ac3f-35046ddf51af.png)

<br/>
