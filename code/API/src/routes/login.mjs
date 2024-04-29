import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { modelCustomer } from "../db/sequelize.mjs";
import { privateKey } from "../auth/privateKey.mjs";
const loginRouter = express();
//login
loginRouter.post("/",(req,res) => {
    modelCustomer.findOne({where : {pseudo: req.body.pseudo}})
    .then((user) => {
        if(!user){
            const message = "L'utilisateur demandé n'existe pas";
            return res.status(404).json({message});
        }
        bcrypt
            .compare(req.body.mot_de_passe, user.mot_de_passe)
            .then((isPasswordValid) => {
                if(!isPasswordValid){
                    const message = `Le mot de passe est incorrecte.`;
                    return res.status(401).json({message});
                }
                else{
                    //jwt
                    const token = jwt.sign({id: user.id}, privateKey, {
                        expiresIn: "1y",
                    });
                    const message = `L'utilisateur a été connecté avec succès`;
                    return res.json({message, data: user,token});
                }
            });
    })
    .catch((error) => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants`;
        return res.json({message, data: error});
    });
});
export{loginRouter};