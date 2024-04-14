const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { mongodb_url, port } = require("./config");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, handleError } = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(express.urlencoded());
 
 
//default cors policy
app.use(cors());

//custom cors policy
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"],
//   })
// );

 
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);


app.use(notFound);
app.use(handleError);

mongoose.connect(mongodb_url).then(() => {
  app.listen(port, () => console.log(` app listening on port ${port}`));
});
    