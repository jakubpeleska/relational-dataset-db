- Written in [BabelScript](https://babeljs.io/).
- [React](http://facebook.github.io/react/), [Flux](https://facebook.github.io/flux/), [react-router](https://github.com/rackt/react-router), [immutable.js](http://facebook.github.io/immutable-js/).
- Dev stack based on [gulp.js](http://gulpjs.com/) and [webpack](http://webpack.github.io/) configured both for dev and production.
- Server side rendering.
- CSS livereload and webpack module hot reload.

## Prerequisites

Install [iojs](https://iojs.org/) or [node.js](http://nodejs.org) (version 6.10.3 works, version 12 does not work anymore).
Then install [gulp.js](http://gulpjs.com/) (the code relies on version 3.9.0).
```shell
  npm install -g gulp@3.9.0
```

Some npm modules are required.
```shell
  npm install async
  npm install ladda
```
For dataset schema image generation, install [graphviz](http://www.graphviz.org/).

## Install

```shell
  git clone https://gitlab.fit.cvut.cz/ostrovac/dataset-repo.git
  cd dataset-repo
  npm install
```

## Run

- `gulp` start development
- `gulp -p` run app in production mode
- `gulp build -p` build in production mode


## Quality control
- Use [Broken Link Checker](http://www.brokenlinkcheck.com/) to validate that a user cannot accidentally kill the web.

## Upload datasets
- Create a new database on the server.
- Upload the data into the database. Make sure the tables are stored with InnoDB engine (not MyISAM, which doesn't support foreign key constrains). And if possible, prefer UTF-8 character set before latin1_swedish (the default value in old versions of MySQL).
- Add description of the data into meta.database and possibly into meta.dataset.
- Execute /assets/sql/meta_information.sql script to update meta.information.
- Validate the change on the webpage.

## Useful links for developers
- [React.js](http://facebook.github.io/react/).
- [What is the Flux application architecture](https://medium.com/brigade-engineering/what-is-the-flux-application-architecture-b57ebca85b9e).
- [Learn ES6](https://babeljs.io/docs/learn-es6/).
- [Immutable.js](http://facebook.github.io/immutable-js/) and [the case for immutability](https://github.com/facebook/immutable-js/#the-case-for-immutability).
- [Express.js](http://expressjs.com/)
- [Node.js](http://nodejs.org/api/)
- [Isomorphic javascript](http://isomorphic.net/javascript)