import express from 'express'
import cors from 'cors'
import CookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDatabase from './database/db.js'
import authRouter from './routes/auth.routes.js'
import clientRouter from './routes/client.routes.js'
// import adminRouter from './routes/admin.routes.js'
import storeRouter from './routes/store.routes.js'
import investmentRouter from './routes/investment.routes.js'
import profitRouter from './routes/profit.routes.js'
import dashboardClientRouter from './routes/clientdashboard.routes.js'

const app = express()

dotenv.config()

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(CookieParser())
app.use(express.json())

app.use(cors(corsOptions))

const PORT = process.env.PORT || 8000

// Routes

app.use('/api/auth', authRouter)
app.use('/api/clients', clientRouter)
// app.use('/api/admin', adminRouter)
app.use('/api/stores', storeRouter)
app.use('/api/investments', investmentRouter)
app.use('/api/profits', profitRouter)
app.use('/api/clientdashboard', dashboardClientRouter)

// Run server

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDatabase()
})
