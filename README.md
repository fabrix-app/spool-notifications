# spool-notifications

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

Notifications for Fabrix

## Install

```sh
$ npm install --save @fabrix/spool-notifications
```

## Configure

```js
// config/main.ts
import { NotificationsSpool } from '@fabrix/spool-notifications'
export const main = {
  spools: [
    // ... other spools
    NotificationsSpool
  ]
}
```

[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-notifications.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-notifications
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-notifications/nmaster.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-notifications/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-notifications.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-notifications
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-notifications.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-notifications/coverage
