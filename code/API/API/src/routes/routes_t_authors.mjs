import express from "express";
import { success } from "./helper.mjs";
import { modelAuthor } from "../db/sequelize.mjs";
import { ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import { modelBook } from "../db/sequelize.mjs";

const authorRouter = express();

///// Get ALL authors

authorRouter.get("/",auth, (req, res) => {
    if (req.query.author) {
        if (req.query.author.length < 2) {
            const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
            return res.status(400).json({ message });
            }
        let limit = 3;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        return modelAuthor.findAndCountAll({
            where: { author: { [Op.like]: `%${req.query.author}%` } },
            order: ["name"],
            limit: limit,
        }).then((authors) => {
            const message = `Il y a ${authors.count} auteurs qui correspondent au terme de la recherche`;
            res.json(success(message, authors));
        });
    }
    modelAuthor.findAll({order:["name"]}).then((authors) => {
        const message = "La liste des auteurs a bien été récupérée.";
        res.json(success(message, authors));
    })
        .catch((error) => {
            const message =
                "La liste des auteurs n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

//// Get one author by id

authorRouter.get("/:id", auth, (req, res) => {
  modelAuthor
    .findByPk(req.params.id)
    .then((author) => {
      if (author === null) {
        const message =
          "L'auteur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      const message = `L'auteur dont l'id vaut ${author.id} a bien été récupéré.`;
      res.json(success(message, author));
    })
    .catch((error) => {
      const message =
        "L'auteur  n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

//// Poost a author
// Exemple of a post :
// curl -X POST http://localhost:3000/api/authors -H "Content-Type: application/json" -d '{"name": "HamburgerVaudois","price": 9.99}'

authorRouter.post("/", auth, (req, res) => {
  modelAuthor
    .create(req.body)
    .then((createdAuthor) => {
      const message = `L'auteur [${createdAuthor.author}] a bien été créé !`;
      res.json(success(message, createdAuthor));
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }
      const message =
        "L'auteur  n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

//// Delete a author
//curl -X DELETE http://localhost:3000/api/authors/1
authorRouter.delete("/:id", auth, (req, res) => {
  modelAuthor
    .findByPk(req.params.id)
    .then((deletedAuthor) => {
      if (deletedAuthor === null) {
        const message =
          "L'auteur' demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
        return res.status(404).json({ message });
      }
      return modelAuthor
        .destroy({
          where: { id: deletedAuthor.id },
        })
        .then((_) => {
          const message = `L'auteur [${deletedAuthor.author}] a bien été supprimé !`;
          res.json(success(message, deletedAuthor));
        });
    })
    .catch((error) => {
      const message =
        "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

//Put a author

authorRouter.put("/:id", auth, (req, res) => {
  const authorId = req.params.id;
  modelAuthor
    .update(req.body, { where: { id: authorId } })
    .then((_) => {
      return Product.findByPk(productId).then((updatedAuthor) => {
        if (updatedAuthor === null) {
          const message =
            "L'auteur demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
          return res.status(404).json({ message });
        }
        const message = `L'auteur : [${updatedAuthor.author}], dont l'id vaut ${updatedAuthor.id} a été mis à jour avec succès`;
        res.json(success(message, updatedAuthor));
      });
    })
    .catch((error) => {
      const message =
        "L'auteur n'a pas pu être mis à jour. Merci de réessayer dans quelques instants.";
      res.status(500).json({ message, data: error });
    });
});

// Route pour obtenir les livres par ID auteur
authorRouter.get("/:id/books", auth, (req, res) => {
    // Vérifier si le paramètre ID auteur existe dans la requête
    if(req.params.id) {
        // Trouver un enregistrement dans la table "Auteur" où l'ID auteur correspond
        return modelAuthor.findOne({
            where: { id: req.params.id },
        }).then((author) => {
            // Si aucun enregistrement n'est trouvé pour l'ID auteur, renvoyer une erreur 404
            if (!author) {
                const message = "Auteur non trouvé. Veuillez vérifier l'identifiant et réessayer.";
                return res.status(404).json({ message });
            }
            // Trouver tous les livres associés à l'ID auteur
            return modelBook.findAll({
                where: { authors_id: author.id },
            }).then((books) => {
                // Si des livres sont trouvés, les renvoyer avec un message de succès
                if(books.length !== 0){
                    const message = `Voici tous les livres de l'auteur avec l'identifiant "${author.id}".`;
                    res.json({ message, books });
                } else {
                    // Si aucun livre n'est associé à l'auteur, renvoyer un message approprié
                    const message = `L'auteur avec l'identifiant "${author.id}" n'a aucun livre associé.`;
                    res.json({ message });
                }
            }).catch((error) => {
                // S'il y a une erreur lors de la récupération des livres, renvoyer une erreur 500
                const message = "La liste des livres n'a pas pu être récupérée. Veuillez réessayer dans quelques instants.";
                res.status(500).json({ message, data: error });
            });
        }).catch((error) => {
            // S'il y a une erreur lors de la récupération de l'auteur, renvoyer une erreur 500
            const message = "Une erreur s'est produite lors de la récupération de l'auteur. Veuillez réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });        
    } else {
        // Si aucun ID auteur n'est fourni dans la requête, renvoyer une erreur 400
        const message = "Veuillez fournir un identifiant d'auteur valide.";
        res.status(400).json({ message });
    }
  });
  

export { authorRouter };
