const mongoose = require('mongoose')

const mongoURI = 'mongodb+srv://Pawan:Pawan1234@cluster.tugic.mongodb.net/iNoteBook?retryWrites=true&w=majority'

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('Connected to database')
    })
}
                            
module.exports = connectToMongo