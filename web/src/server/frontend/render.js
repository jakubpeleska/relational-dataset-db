import DocumentTitle from 'react-document-title';
import Html from './html.react';
import React from 'react';
import Router from 'react-router';
import routes from '../../client/routes';
import resolver from '../../lib/resolver';
import {state} from '../../client/state.js';

export default function render(request, response) {
  return new Promise((resolve, reject) => {
    const router = Router.create({
      routes: routes,
      location: request.originalUrl,
      onError: reject,
      onAbort: (abortReason) => {
        if (abortReason.constructor.name === 'Redirect') {
          const {to, params, query} = abortReason;
          const path = router.makePath(to, params, query);
          response.redirect(path);
          resolve();
          return;
        }
        reject(abortReason);
      }
    });

    router.run((Handler, routerState) => {
      getPageHtml(Handler)
        .then((html) => {
          const notFound = routerState.routes.some(route => route.name === 'not-found');
          const status = notFound ? 404 : 200;
          response.status(status).send(html);
          resolve();
        })
        .catch(error => reject(error));
    });
  });
}

function getPageHtml(Handler) {
  return new Promise((resolve, reject) => {
    resolver.render(Handler)
      .then((appHtml) => {
        const title = DocumentTitle.rewind();
        resolve('<!DOCTYPE html>' + React.renderToStaticMarkup(
          <Html
            appHtml={appHtml}
            appState={state.save()}
            title={title}
          />
        ));
      })
      .catch(error => reject(error));
  });
}
