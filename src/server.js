import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import request from 'request'
import configurations from './config'
import { config } from 'dotenv'
// import cors from 'cors'
// import { signup, signin, protect } from './utils/auth'
import { connect } from './utils/db'
// import userRouter from './resources/user/user.router'
// import itemRouter from './resources/item/item.router'
// import listRouter from './resources/list/list.router'

export const app = express()

config()

app.disable('x-powered-by')

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

// app.post('/signup', signup)
// app.post('/signin', signin)

// app.use('/api', protect)
// app.use('/api/user', userRouter)
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// const line = 'MTABC_Q60'

app.get('/api/mta/oneLine', (req, res) => {
  const line = req.query.line
  const direction = req.query.direction

  console.table({ line, direction })
  request(
    {
      url: `https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=${
        process.env.REACT_APP_MTA_API_KEY
      }&LineRef=${line}&DirectionRef=${direction}`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error.message })
      }

      res.json(JSON.parse(body))
    }
  )
})

app.get('/api/mta/allLines', (req, res) => {
  request(
    {
      url: `https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=${
        process.env.REACT_APP_MTA_API_KEY
      }`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: error.message })
      }

      res.json(JSON.parse(body))
    }
  )
})

export const start = async () => {
  try {
    await connect()
    app.listen(configurations.port, () => {
      console.log(`REST API on http://localhost:${configurations.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
