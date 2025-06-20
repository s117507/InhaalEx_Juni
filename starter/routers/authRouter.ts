import e, { Router } from "express";
import { getAllResearchers } from "../database";

export function authRouter() {
    const router = Router();

    router.get("/login", async(req, res) => {
        const researchers = await getAllResearchers();
        res.render("login", 
            {
                researchers
            }
        );
    });

    router.post("/login", async(req, res) => {
        res.redirect("/login");
    });

    router.post("/logout", (req, res) => {  
        res.redirect("/login");
    });

    return router;
}