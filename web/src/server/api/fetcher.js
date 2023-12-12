export default function(fetcher) {
  return (request, response, next) => {
    const methodName = request.path.split('\/')[1];

    const method = fetcher.mapping[methodName];
    const params = request.method === 'GET'
      ? request.query
      : request.body;

    if (typeof method === 'function') {
      method.call(null, params)
        .then((data) => {
          response.json(data);
        }).catch(next);
    } else {
      response.sendStatus(404);
    }
  };
}
