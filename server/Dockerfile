FROM node:18
WORKDIR /usr/src/app/server
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD [ "npm", "run", "start" ]