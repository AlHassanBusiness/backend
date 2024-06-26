const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const connectDatabase = require('./database/db')
const authRouter = require('./routes/auth.routes')
const clientRouter = require('./routes/client.routes')
// const adminRouter = require('./routes/admin.routes.js') // Uncomment if needed
const storeRouter = require('./routes/store.routes')
const investmentRouter = require('./routes/investment.routes')
const profitRouter = require('./routes/profit.routes')
const dashboardClientRouter = require('./routes/clientdashboard.routes')

const app = express()

dotenv.config()

const corsOptions = {
    origin: ['https://admin-kappa-orpin.vercel.app', 'https://client-eight-theta-44.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cookieParser())
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
