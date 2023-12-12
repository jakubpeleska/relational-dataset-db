FROM node:6.10.3 AS base

# Create app directory
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
FROM base as build
RUN npm install -g gulp@3.9.0
COPY package.json /usr/src/app/
RUN npm install
RUN gulp build -p


# Production stage
FROM node:6.10.3

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/assets /usr/src/app/assets
COPY --from=build /usr/src/app/build /usr/src/app/build
COPY --from=build /usr/src/app/package.json /usr/src/app/package.json
COPY --from=build /usr/src/app/src /usr/src/app/src

CMD [ "node", "src/server" ]

