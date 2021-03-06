# Set the base image to Node 8.7
FROM node:8.7.0

# File Author / Maintainer
MAINTAINER Sawyer Blue Burnett

# Copy files needed for Node app to install / run
COPY package.json package.json
COPY server.js server.js
COPY views/ ./views/
COPY public/ ./public

# Install NPM packages
RUN npm install
RUN npm install -g forever

# Start the node server
CMD ["forever", "./server.js"]