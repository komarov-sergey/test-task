# for run local:
## run BE:
- cd server
- npm i
- npm run dev
## run FE:
- cd client
- npm i
- npm start

# for run with docker:

## docker for BE:
docker build . -t test-task/node-web-app
docker run -p 3002:3002 -d test-task/node-web-app

## docker for BE:
docker build . -t test-task/client-node-web-app
docker run -p 3000:3000 -d test-task/client-node-web-app