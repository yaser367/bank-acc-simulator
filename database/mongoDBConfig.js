const mongoose = require('mongoose')
const config = async () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Database Connected.')
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = config;