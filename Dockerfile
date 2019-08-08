FROM circleci/node:10.13-jessie-browsers
RUN sudo mkdir /resume && sudo chown circleci /resume
WORKDIR /resume
COPY package.json package-lock.json ./
RUN npm install
COPY public scripts src .eslint* .prettierrc config-overrides.js *config.js ./
CMD npm run int-test-ci
