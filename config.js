require('dotenv').config()

 const MONGODB_URL=process.env.MONGODB_URL

const SECRET_KEY=process.env.SECRET_KEY


  const PORT=process.env.PORT|| process.env.port



 module.exports  ={MONGODB_URL , PORT,SECRET_KEY};
 