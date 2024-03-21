import express, { application } from "express";

const server = express();
server.use(express.json());

//routes
server.get("/", (req, res) => {
    res.json("Hello World");
});

const PORT = 3333;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
