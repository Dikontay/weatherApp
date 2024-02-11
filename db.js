const mongoose = require('mongoose');

const connectionString=process.env.MONGODB_URI;
mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
})
.then(()=>console.log('Connection established '))
.catch(err=>console.error('Db connection error',err));