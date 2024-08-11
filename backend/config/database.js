const mongoose =require('mongoose')

const connectDatabse = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI)
    .then(con=>{
        console.log(`MongoDB is connected to the host: ${con.connection.host}`);
    })
}

module.exports = connectDatabse;

// no effect since Node.js Driver version 4.0.0 and will be removed in the next major version [line::4]
// {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }