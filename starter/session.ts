import dotenv from "dotenv";
dotenv.config();
import session, { MemoryStore } from "express-session";
import { Researcher } from "./types";
import mongoDbSession from "connect-mongodb-session";


const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: "mongodb+srv://estalistrinev:tPqvaqEIdP7z9KM1@mijnproject.udzcq5y.mongodb.net/?retryWrites=true&w=majority&appName=mijnProject",
    collection: "sessions",
    databaseName: "login-express",
});

declare module 'express-session' {
    export interface SessionData {
        
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: new MemoryStore(),
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
});