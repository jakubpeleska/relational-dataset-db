FROM ubuntu:18.04 AS prepare

RUN apt-get update
RUN apt-get install -y curl

FROM prepare as nodejs
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 6.10.3
RUN mkdir $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN echo "source $NVM_DIR/nvm.sh && \
    nvm install $NODE_VERSION && \
    nvm alias default $NODE_VERSION && \
    nvm use default" | bash

FROM nodejs as base
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install global dependencies
RUN apt-get install -y graphviz
RUN npm install -g gulp@3.9.0

# Install app dependencies
FROM base as build
COPY . /usr/src/app
RUN npm install
RUN gulp build -p


# Production stage
FROM build as final

WORKDIR /usr/src/app
ENV NODE_ENV=production


CMD [ "node", "src/server" ]

