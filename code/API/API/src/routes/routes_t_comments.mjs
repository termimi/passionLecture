import express from "express";
import { success } from "./helper.mjs";
import { modelComment } from "../db/sequelize.mjs";
import { ValidationError, Op } from 'sequelize';

const commentsRouter = express();

///// Get ALL comments

commentsRouter.get("/", (req, res) => {
    if (req.query.comment) {
        if (req.query.comment.length < 2) {
            const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
            return res.status(400).json({ message });
            }
        let limit = 3;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        return modelComment.findAndCountAll({
            where: { comment: { [Op.like]: `%${req.query.comment}%` } },
            order: ["comment"],
            limit: limit,
        }).then((comments) => {
            const message = `Il y a ${comments.count} comments qui correspondent au terme de la recherche`;
            res.json(success(message, comments));
        });
    }
    modelComment.findAll({order:["comment"]}).then((comments) => {
        const message = "La liste des comments a bien été récupérée.";
        res.json(success(message, comments));
    })
        .catch((error) => {
            const message =
                "La liste des comments n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

//// Get one comment by id

commentsRouter.get("/:id", (req, res) => {
    modelComment.findByPk(req.params.id).then((comment) => {
        if (comment === null) {
            const message =
                "La comment demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
            return res.status(404).json({ message });
        }
        const message = `La comment dont l'id vaut ${comment.id} a bien été récupéré.`;
        res.json(success(message, comment));
    })
        .catch((error) => {
            const message =
                "La comment  n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


//// Poost a comment
// Exemple of a post :
// curl -X POST http://localhost:3000/api/comments -H "Content-Type: application/json" -d '{"name": "HamburgerVaudois","price": 9.99}'


commentsRouter.post("/", (req, res) => {
    modelComment.create(req.body).then((createdComment) => {
        const message = `La comment [${createdComment.comment}] a bien été créé !`;
        res.json(success(message, createdComment));
    })
        .catch((error) => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message =
                "La comment  n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

//// Delete a comment
//curl -X DELETE http://localhost:3000/api/comments/1
commentsRouter.delete("/:id", (req, res) => {
    modelComment.findByPk(req.params.id)
        .then((deletedComment) => {
            if (deletedComment === null) {
                const message =
                    "Le la comment demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                return res.status(404).json({ message });
            }
            return modelComment.destroy({
                where: { id: deletedComment.id },
            }).then((_) => {
                const message = `La comment [${deletedComment.comment}] a bien été supprimé !`;
                res.json(success(message, deletedComment));
            });
        })
        .catch((error) => {
            const message = "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


//Put a comment

commentsRouter.put("/:id", (req, res) => {
    const commentId = req.params.id;
    modelComment.update(req.body, { where: { id: commentId } })
        .then((_) => {
            return Product.findByPk(productId).then((updatedComment) => {
                if (updatedComment === null) {
                    const message = "La comment demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                    return res.status(404).json({ message });
                }
                const message = `La comment : [${updatedComment.comment}], dont l'id vaut ${updatedComment.id} a été mis à jour avec succès`;
                res.json(success(message, updatedComment));
            });
        })
        .catch((error) => {
            const message = "La comment n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


export { commentsRouter };