const mongoose = require('mongoose');
beforeAll((done) => {
    mongoose.connect(global.__MONGO_URI__, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then((db) => {
        console.log('Connected ...');
        done();
    }).catch
})
//Tear down
afterAll((done) => {
    mongoose.disconnect().then(() => {
        console.log('Disconnecting ...');
        done();
    });
})
