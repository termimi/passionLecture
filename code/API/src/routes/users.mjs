import express from "express";
import { success, getUniqueUserId } from "./helper.mjs";
import { modelBook, modelCustomer } from "../db/sequelize.mjs";
import { BookModel } from "../model/t_books.mjs";
import { BaseError, Error, ValidationError, Op } from "sequelize";
import { auth } from "../auth/auth.mjs";
import bcrypt from "bcrypt";

const customerRouter = express();

customerRouter.get("/", auth, (req, res) => {
  if (req.query.pseudo) {
    if (req.query.pseudo.length < 2) {
      const message = "Veuillez faire une recherche a plus de 1 caractère";
      return res.status(400).json({ message });
    }
    let dynamicLimit = 5;
    if (req.query.limit) {
      dynamicLimit = parseInt(req.query.limit);
    }
    return modelCustomer.findAll({
      where: { pseudo: { [Op.like]: `%${req.query.pseudo}%` } },
      order: ["pseudo"],
      limit: dynamicLimit,
    }).then((usersList) => {
      const message = `Il y a ${usersList.length} utilisateurs qui correspondent à votre recherche`;
      res.json(success(message, usersList));
    });
  }
  modelCustomer.findAll()
    .then((usersData) => {
      const message = "La liste des utilisateurs a bien été récupérée.";
      res.json(success(message, usersData));
    })
    .catch((error) => {
      const message =
        "La liste des utilisateur n'a pas pu être récupérée. Merci de réessayer dans quelques instants";
      res.status(500).json({ message, data: error });
    });
});
customerRouter.get("/:id", auth, (req, res) => {
  modelCustomer.findByPk(req.params.id)
    .then((usersData) => {
      const message = `L'utilisateur dont l'id vaut ${usersData.id} a bien été récupéré.`;
      res.json(success(message, usersData));
    })
    .catch((error) => {
      const message = `L'utilisateur ayant l'id ${req.params.id} n'as pas pu être trouver`;
      res.status(404).json({ message, data: error });
    });
});

customerRouter.post("/", (req, res) => {
  bcrypt.hash(req.body.mot_de_passe, 10).then((hashedPWD) => {
    req.body.mot_de_passe = hashedPWD;
    modelCustomer.create(req.body)
      .then((userCreated) => {
        const message = `L'utilisateur ${userCreated.pseudo} à bien été créé`;
        res.json(success(message, userCreated));
      })
      .catch((error) => {
        const message = `L'utilisateur n'a pas pu être ajouter`;
        res.status(500).json({ message, data: error });
      });
  });
});

customerRouter.delete("/:id", auth, (req, res) => {
  let deletedUser;
  modelCustomer.findByPk(req.params.id)
    .then((userDeleted) => {
      deletedUser = userDeleted;
      if (userDeleted == null) {
        const message = `L'utilisateur ${req.params.id} n'as pas été trouvé`;
        res.status(404).json({ message, data: error });
      }
      return modelCustomer.destroy({
        where: { id: userDeleted.id },
      });
    })
    .then((_) => {
      const message = `L'utilisateur ${deletedUser.pseudo} à bien été supprimé`;
      res.json(success(message, deletedUser));
    })
    .catch((error) => {
      const message = `L'utilisateur ${req.params.id} n'as pas pu être supprimé`;
      return res.status(500).json({ message, data: error });
    });
});

customerRouter.put("/:id", auth, (req, res) => {
  let userID = req.params.id;
  modelCustomer.update(req.body, { where: { id: userID } })
    .then((_) => {
      return modelCustomer.findByPk(userID).then((userFinded) => {
        if (userFinded == null) {
          const message = `L'utilisateur ayant l'id ${userID} n'as pas pu être trouvé`;
          return res.status(404).json({ message });
        }
        const message = `L'utilisateur ${userFinded.pseudo} dont l'id vaut ${userID} a été mis à jour avec succès !`;
        res.json(success(message, userFinded));
      });
    })
    .catch((error) => {
      const message = `L'utilisateur ayant l'id ${userID} n'as pas pu être modifier`;
      if (error instanceof ValidationError) {
        return res.status(500).json({ message, data: error });
      }
      res.status(500).json({ message, data: error });
    });
});

//Merci à Ethan pour la logique de ce code (ne pas utiliser les relation) :

// Route pour obtenir les livres par ID utilisateur
customerRouter.get("/:id/books", auth, (req, res) => {
  // Vérifier si le paramètre ID utilisateur existe dans la requête
  if(req.params.id) {
      // Trouver un enregistrement dans la table "User" où l'ID utilisateur correspond
      return modelCustomer.findOne({
          where: { id: req.params.id },
      }).then((user) => {
          // Si aucun enregistrement n'est trouvé pour l'ID utilisateur, renvoyer une erreur 404
          if (!user) {
              const message = "Utilisateur non trouvé. Veuillez vérifier l'identifiant et réessayer.";
              return res.status(404).json({ message });
          }
          // Trouver tous les livres associés à l'ID utilisateur
          return modelBook.findAll({
              where: { customers_id: user.id },
          }).then((books) => {
              // Si des livres sont trouvés, les renvoyer avec un message de succès
              if(books.length !== 0){
                  const message = `Voici tous les livres de l'utilisateur avec l'identifiant "${user.id}".`;
                  res.json({ message, books });
              } else {
                  // Si aucun livre n'est associé à l'utilisateur, renvoyer un message approprié
                  const message = `L'utilisateur avec l'identifiant "${user.id}" n'a aucun livre associé.`;
                  res.json({ message });
              }
          }).catch((error) => {
              // S'il y a une erreur lors de la récupération des livres, renvoyer une erreur 500
              const message = "La liste des livres n'a pas pu être récupérée. Veuillez réessayer dans quelques instants.";
              res.status(500).json({ message, data: error });
          });
      }).catch((error) => {
          // S'il y a une erreur lors de la récupération de l'utilisateur, renvoyer une erreur 500
          const message = "Une erreur s'est produite lors de la récupération de l'utilisateur. Veuillez réessayer dans quelques instants.";
          res.status(500).json({ message, data: error });
      });        
  } else {
      // Si aucun ID utilisateur n'est fourni dans la requête, renvoyer une erreur 400
      const message = "Veuillez fournir un identifiant d'utilisateur valide.";
      res.status(400).json({ message });
  }
});


export { customerRouter };
