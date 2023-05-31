## run BE:
- cd server
- npm i
- npm run dev

## run FE:
- cd client
- npm i
- npm start

----

docker for BE:
docker build . -t test-task/node-web-app
docker run -p 3002:3002 -d test-task/node-web-app