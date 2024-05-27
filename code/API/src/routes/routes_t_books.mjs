import express from "express";
import { success } from "./helper.mjs";
import { modelBook } from "../db/sequelize.mjs";
import { modelComment } from "../db/sequelize.mjs";
import { ValidationError, Op } from 'sequelize';
import { auth } from "../auth/auth.mjs";
import { modelCategory } from "../db/sequelize.mjs";

const booksRouter = express();

///// Get ALL books

booksRouter.get("/", (req, res) => {
    if (req.query.title) {
        if (req.query.title.length < 2) {
            const message = `Le terme de la recherche doit contenir au moins 2 caractères`;
            return res.status(400).json({ message });
        }
        let limit = 3;
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
        }
        return modelBook.findAndCountAll({
            where: { title: { [Op.like]: `%${req.query.title}%` } },
            order: ["title"],
            limit: limit,
        }).then((books) => {
            const message = `Il y a ${books.count} livres qui correspondent au terme de la recherche`;
            res.json(success(message, books));
        });
    }
    modelBook.findAll({order: ["title"] }).then((books) => {
        const message = "La liste des livres a bien été récupérée.";
        res.json(success(message, books));
    })
    .catch((error) => {
         const message =
            "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
         res.status(500).json({ message, data: error });
    });
});

booksRouter.get('/title',(req,res) => {
    modelBook.findAll({attributes:['title'],order: ["title"] }).then((books) => {
        const message = "La liste des livres a bien été récupérée.";
        res.send(JSON.stringify(books));
    })
    .catch((error) => {
         const message =
            "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
         res.status(500).json({ message, data: error });
    });
})

booksRouter.get("/numberOfBook", /*auth,*/ (req, res) => {
    modelBook.findAll({ order: ["title"] }).then((books) => {
        const message = "La liste des livres a bien été récupérée.";
        /*res.set({
            'Content-Type': 'application/epub+zip',
            'Content-Disposition': 'attachment; filename="nom_du_fichier.epub"'
          });*/
         console.log(books)
         res.status(200).json(books.length);   
    })
    .catch((error) => {
         const message =
            "La liste des livres n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
         res.status(500).json({ message, data: error });
    });
});

//// Get one book by id

booksRouter.get("/:id", /*auth,*/ (req, res) => {
    modelBook.findByPk(req.params.id).then((book) => {
        if (book === null) {
            const message =
                "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
            return res.status(404).json({ message });
        }
        const message = `Le livre dont l'id vaut ${book.id} a bien été récupéré.`;
        res.json(success(message, book.title));
    })
        .catch((error) => {
            const message =
                "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

booksRouter.get("/:id/epub", /*auth,*/ (req, res) => {
    modelBook.findByPk(req.params.id).then((book) => {
        if (book === null) {
            const message =
                "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
            return res.status(404).json({ message });
        }
        const message = `Le livre dont l'id vaut ${book.id} a bien été récupéré.`;
        res.set({
            'Content-Type': 'application/epub+zip',
            'Content-Disposition': 'attachment; filename="nom_du_fichier.epub"'
          });
        res.status(200).send(book.epub)
    })
        .catch((error) => {
            const message =
                "Le livre n'a pas pu être récupéré. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

booksRouter.get("/", (req, res) => {
    if (req.query.categorie) {
        modelCategory.findAll(
            { where: { category: { [Op.like]: `%${req.query.categorie}%` } } })
            .then((categorieFinded) => {
                modelBook.findAll({ where: { categories_id: { [Op.eq]: categorieFinded.id } } })
            }).then((books) => {
                const message = `Voici tout les livre ayant comme catégorie ${req.query.categorie}`;
                res.json(success(message, books));
            })
    }
})


//// Poost a book
// Exemple of a post :
// curl -X POST http://localhost:3000/api/books -H "Content-Type: application/json" -d '{"name": "HamburgerVaudois","price": 9.99}'


booksRouter.post("/", auth, (req, res) => {
    modelBook.create(req.body).then((createdBook) => {
        const message = `Le livre [${createdBook.title}] a bien été créé !`;
        res.json(success(message, createdBook));
    })
        .catch((error) => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message =
                "Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

//// Delete a book
//curl -X DELETE http://localhost:3000/api/books/1
booksRouter.delete("/:id", auth, (req, res) => {
    modelBook.findByPk(req.params.id)
        .then((deletedBook) => {
            if (deletedBook === null) {
                const message =
                    "Le livre demandé n'existe pas. Merci de réessayer avec un autre identifiant.";
                return res.status(404).json({ message });
            }
            return modelBook.destroy({
                where: { id: deletedBook.id },
            }).then((_) => {
                const message = `Le livre [${deletedBook.title}] a bien été supprimé !`;
                res.json(success(message, deletedBook));
            });
        })
        .catch((error) => {
            const message = "Le produit n'a pas pu être supprimé. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


//Put a book

booksRouter.put("/:id", auth, (req, res) => {
    let bookId = req.params.id;
    modelBook.update(req.body, { where: { id: bookId } })
      .then((_) => {
        return modelBook.findByPk(bookId).then((bookFinded) => {
          if (bookFinded == null) {
            const message = `Le livre ayant l'id ${bookId} n'as pas pu être trouvé`;
            return res.status(404).json({ message });
          }
          const message = `Le livre ${bookFinded.pseudo} dont l'id vaut ${bookId} a été mis à jour avec succès !`;
          res.json(success(message, bookFinded));
        });
      })
      .catch((error) => {
        const message = `Le livre ayant l'id ${bookId} n'as pas pu être modifier`;
        if (error instanceof ValidationError) {
          return res.status(500).json({ message, data: error });
        }
        res.status(500).json({ message, data: error });
      });
  });

//Imbriquée :

booksRouter.get("/:id/comments/", auth, async (req, res) => {

    modelBook.findByPk(req.params.id)
        .then((book) => {
            if (book === null) {
                const message =
                    "Le livre demandée n'existe pas. Merci de réessayer avec un autre identifiant.";
                return res.status(404).json({ message });
            }
            return modelComment.findAndCountAll({
                where: {
                    books_id: book.id,
                },
                order: ["comment"],
            }).then((comments) => {
                let message;
                if (comments.count === 0) {
                    message = `Il n'y a pas de commentaires pour la catégorie dont l'id vaut ${book.id}.`;
                } else {
                    message = `La liste des commentaires de la catégorie dont l'id vaut ${book.id} a bien été récupérée.`;
                }
                res.json({ message, data: comments });
            });
        })
        .catch((error) => {
            const message =
                "La liste des commentaires du livre n'a pas pu être récupérée. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});

booksRouter.post("/:id/comments/", auth, (req, res) => {
    const commentData = { ...req.body, books_id: req.params.id }; // Ajouter req.params.id comme books_id
    modelComment.create(commentData)
        .then((createdComment) => {
            const message = `Le commentaire [${createdComment.comment}] a bien été créé !`;
            res.json(success(message, createdComment));
        })
        .catch((error) => {
            if (error instanceof ValidationError) {
                return res.status(400).json({ message: error.message, data: error });
            }
            const message ="Le livre n'a pas pu être ajouté. Merci de réessayer dans quelques instants.";
            res.status(500).json({ message, data: error });
        });
});


export { booksRouter };