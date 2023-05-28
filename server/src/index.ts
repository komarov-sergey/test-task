import {AppDataSource} from './data-source'
import Koa from 'koa'
import koaBody from 'koa-body'

import api from './routes'

const app = new Koa()
const port = 3002

AppDataSource.initialize()
  .then(() => {
    app.use(koaBody()).use(api.routes()).listen(port)
  })
  .catch((error) => console.log(error))
