const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const { MONGODB_URL, port } = require("./config");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");
const likeRoutes = require("./routes/likeRoutes");

const { notFound, handleError } = require("./middleware/errorMiddleware");

app.use(express.json());

//default cors policy
app.use(cors());

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/likes", likeRoutes);

app.use(notFound);
app.use(handleError);

mongoose.connect(MONGODB_URL).then(() => {
  app.listen(port, () => console.log(` app listening on port ${port}`));
});
