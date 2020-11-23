import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'
import indexRouter from './routes/index'
import advertRouter from './routes/advert'
import queryString from 'querystring'
import bodyParser from './middlewares/body-parser'
import errLog from './middlewares/error-log'

const app = express()

app.use('/node_modules', express.static(config.node_modules_path))
app.use('/public', express.static(config.public_path))

nunjucks.configure(config.viewPath, {
    autoescape: true,
    express: app,
    noCache: true
})


app.use(bodyParser)
app.use(indexRouter)
app.use(advertRouter)
app.use(errLog)

app.listen(3000,()=>{
    console.log('server is running at port 3000...');
})

