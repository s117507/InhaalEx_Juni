import e, { Router } from "express";
import { getAllResearchers, login } from "../database";
import { Researcher } from "../types";

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
        const username : string = req.body.username;
        const pincode : string = req.body.pincode;

       /*try {
            let researcher : Researcher = await login(username, pincode);
            delete researcher.pincode;
            req.session.user = s;
        }
*/

        res.redirect("/login");
    });

    router.post("/logout", (req, res) => {  
        res.redirect("/login");
    });

    return router;
}