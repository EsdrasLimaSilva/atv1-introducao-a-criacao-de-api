import express, { application } from "express";
import { v4 as uuid } from "uuid";

const server = express();
server.use(express.json());

//types
type TechnologyType = {
    title: string;
    studied: boolean;
    deadline: Date;
    created_at: Date;
};

type UserType = {
    id: string;
    name: string;
    username: string;
    tencologies: TechnologyType[];
};

// state
const allUsers: UserType[] = [];

server.post("/user", (req, res) => {
    const { name, username } = req.body as { name: string; username: string };

    // checking if user already exits
    const userFound = allUsers.find((usr) => usr.username === username);
    if (userFound)
        return res.status(400).json({
            ok: false,
            error: `User with username '${username}' already exists!`,
        });

    const novoUser: UserType = {
        id: uuid(),
        name,
        username,
        tencologies: [],
    };

    allUsers.push(novoUser);

    res.status(201).json({
        ok: true,
        message: "User created sucessfully",
        data: novoUser,
    });
});

const PORT = 3333;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
