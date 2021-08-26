const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];
const app = require('express')();
const mongoose = require('mongoose');

require('./config/express')(app);
require('./config/routes')(app);

// Mongo DB Connection 
mongoose.connect("mongodb+srv://bcbeltran:blahblah@cluster0.vvne6.mongodb.net/cubicleWorkshop?retryWrites=true&w=majority",  {
    dbName: "cubicleWorkshop",
    user: "bcbeltran",
    pass: "blahblah",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( (res) => console.log('db connected'))
.catch((err) => console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
      // we're connected!
});

app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));