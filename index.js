const connectToMongo = require('./db/db')
const cors = require('cors')
const express = require('express')

connectToMongo()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())


app.use(express.json())

app.use('/api/notes', require('./routes/notes'))
app.use('/api/auth', require('./routes/auth'))

// app.get('/', (req, res) => {
//     res.send('Hello World')
// })

if(process.env.NODE_ENV == 'production'){
    app.use(express.static('frontend/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html' ))
    })
}

app.listen(port, () => {
    console.log(`App listening on the port http://localhost/${port}`)
})