FROM node:8.7.0

COPY package.json package.json
COPY server.js server.js
COPY views/ ./views/
COPY public/ ./public

RUN npm install

CMD ["npm", "start"]