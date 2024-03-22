import express, { application, RequestHandler } from "express";
import { v4 as uuid } from "uuid";

const server = express();
server.use(express.json());

//types
type TechnologyType = {
    id: string;
    title: string;
    studied: boolean;
    deadline: Date;
    created_at: Date;
};

type UserType = {
    id: string;
    name: string;
    username: string;
    technologies: TechnologyType[];
};

// state
const allUsers: UserType[] = [];

server.post("/users", (req, res) => {
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
        technologies: [],
    };

    allUsers.push(novoUser);

    res.status(201).json({
        ok: true,
        message: "User created sucessfully",
        data: novoUser,
    });
});

type RequestUserType = RequestHandler & { user: UserType };
type RequestBodyTechnology = { title: string; deadline: string };

const checkExistsUserAccount: RequestHandler = (req, res, next) => {
    const { username } = req.headers as { username: string };
    const user = allUsers.find((usr) => usr.username === username);

    if (!user)
        return res.status(400).json({ ok: false, error: "User not exists" });

    (req as unknown as RequestUserType).user = user;

    next();
};

server.get("/technologies", checkExistsUserAccount, (req, res) => {
    const { user } = req as unknown as RequestUserType;
    res.status(200).json({
        ok: true,
        message: "All technologies",
        data: user.technologies,
    });
});

server.post("/technologies", checkExistsUserAccount, (req, res) => {
    const { user } = req as unknown as RequestUserType;
    const { title, deadline } = req.body as RequestBodyTechnology;

    const newTechnology: TechnologyType = {
        id: uuid(),
        title,
        deadline: new Date(deadline),
        created_at: new Date(),
        studied: false,
    };

    const indexUser = allUsers.findIndex((usr) => usr.id == user.id)!;

    allUsers[indexUser].technologies.push(newTechnology);

    res.status(201).json({ ok: true, data: newTechnology });
});

server.put("/technologies/:id", checkExistsUserAccount, (req, res) => {
    const { user } = req as unknown as RequestUserType;
    const { id } = req.params;
    const { title, deadline } = req.body as RequestBodyTechnology;

    const indexUser = allUsers.findIndex((usr) => usr.id == user.id)!;
    const indexTech = allUsers[indexUser].technologies.findIndex(
        (tech) => tech.id === id,
    );

    if (indexTech < 0) {
        return res
            .status(404)
            .json({ ok: false, error: "Technology not found!" });
    }

    const technology = allUsers[indexUser].technologies[indexTech];
    const updatedTechnology = {
        ...technology,
        title,
        deadline: new Date(deadline),
    };

    // changing state
    allUsers[indexUser].technologies[indexTech] = updatedTechnology;

    return res
        .status(200)
        .json({
            ok: true,
            message: "Technology updated successfully!",
            data: updatedTechnology,
        });
});

server.patch(
    "/technologies/:id/studied",
    checkExistsUserAccount,
    (req, res) => {
        const { user } = req as unknown as RequestUserType;
        const { id } = req.params;

        const indexUser = allUsers.findIndex((usr) => usr.id == user.id)!;
        const indexTech = allUsers[indexUser].technologies.findIndex(
            (tech) => tech.id === id,
        );

        if (indexTech < 0) {
            return res
                .status(404)
                .json({ ok: false, error: "Technology not found!" });
        }

        // changing state
        allUsers[indexUser].technologies[indexTech].studied = true;

        return res.status(200).json({
            ok: true,
            message: "Technology 'studied' modified successfully!",
            data: allUsers[indexUser].technologies[indexTech],
        });
    },
);

const PORT = 3333;
server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
