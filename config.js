require('dotenv').config()

 const mongodb_url=process.env.mongodb_url

const SECRET_KEY=process.env.SECRET_KEY


  const port=process.env.PORT|| process.env.port



 module.exports  ={mongodb_url , port,SECRET_KEY};
   