# pubsub
开启服务
node server.babel.js

开启demo worker
node demo/worker.js

http 测试
curl -d "worker=demo&channel=channel1&message=email" http://localhost:8000/send


## build

npm install

## test

npm run test
