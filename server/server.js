const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.DATABASE_URL
mongoose.connect(mongoUrl);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected')
})

const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors())

const routes = require('./routes/routes')
app.use('/api', routes)

app.listen(3001, () => {
    console.log(`Server Started at ${3001}`)
})

const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: mongoUrl } });
const Item = require('./models/item');

agenda.define("check valid", async (job) => {
    console.log("checking not valid...")
    const now = new Date()
    const not_valid = await Item.find({
        valid_to: {
            $lt: now
        }
    })
    console.log(not_valid)
    console.log("checking not valid... done")
});

(async function () {
  await agenda.start()

  await agenda.every("1 minutes", "check valid")

})();
