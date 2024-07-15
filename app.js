const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const connectDatabase = require('./database/db')
const authRouter = require('./routes/auth.routes')
const clientRouter = require('./routes/client.routes')
// const adminRouter = require('./routes/admin.routes.js') 
const storeRouter = require('./routes/store.routes')
const investmentRouter = require('./routes/investment.routes')
const profitRouter = require('./routes/profit.routes')
const dashboardClientRouter = require('./routes/clientdashboard.routes')
const productRouter = require('./routes/product.routes')
const decidedprofitRouter =require('./routes/decidedprofit.routes')
const salesRouter = require('./routes/sales.routes')
const path = require('path')

const app = express()

dotenv.config()

const corsOptions = {
    origin: [
        'https://superadmin.amazoonaustralia.com',
        'https://sellercenteral.amazoonaustralia.com',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cookieParser())
app.use(express.json())

app.use(cors(corsOptions))

const PORT = process.env.PORT || 8000


app.use('/api/auth', authRouter)
app.use('/api/clients', clientRouter)
// app.use('/api/admin', adminRouter)
app.use('/api/stores', storeRouter)
app.use('/api/investments', investmentRouter)
app.use('/api/profits', profitRouter)
app.use('/api/products',productRouter)
app.use('/api/clientdashboard', dashboardClientRouter)
app.use('/api/decidedprofit',decidedprofitRouter)
app.use('/api/sales',salesRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    connectDatabase()
})
