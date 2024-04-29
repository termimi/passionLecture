import { DataTypes, Sequelize } from "sequelize"; //Import de  l'orm
import bcrypt from 'bcrypt';//Import du système de cryptage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

//Import des data
import { dataCustomers } from "./mock-customer.mjs";
import { dataBooks } from "../db/mock-book.mjs";
import { dataCategory } from "../db/mock-category.mjs";
import { dataComment } from "./mock-comment.mjs";
import { dataAuthor } from "./mock-author.mjs";
import { dataWriting } from "./mock-writing.mjs";

//Import des model
import { CustomerModel } from "../model/t_customer.mjs";
import { BookModel } from "../model/t_books.mjs";
import { CategoryModel } from "../model/t_categorys.mjs";
import { Authormodel } from "../model/t_authors.mjs";
import { CommentModel } from "../model/t_comments.mjs";
import { WritingModel } from "../model/t_writing.mjs";




const sequelize = new Sequelize(
    "db_librairie",
    "root",
    "root",
    {
        host: "localhost",
        port: 6033,
        dialect: "mysql",
        //logging: false, // Pour avoir les logs : logging: console.log,
        logging: console.log,
    }
);

//Transformation des model en model sequilize
const modelCustomer = CustomerModel(sequelize, DataTypes);
const modelBook = BookModel(sequelize, DataTypes);
const modelCategory = CategoryModel(sequelize, DataTypes);
const modelComment = CommentModel(sequelize, DataTypes);
// const modelWriting = WritingModel(sequelize, DataTypes);
const modelAuthor = Authormodel(sequelize, DataTypes);

//Fonction de création de la base de donnée (utilisée dans le app.mjs)
let initDB = () => {
    createForeignKeys();//Création des fk
    return sequelize
        .sync({ force: true })
        .then((_) => {
            importCustomer();
            importCategory();
            importBooks(folderPath);
            importAuthor();
            importComment();
            // importWriting();
            console.log("La base de donnée db_librairie a bien été créé");
        });
};


const createForeignKeys = () => {

    //Permet de crée la bonne fk pour la table customer mais il y a des problème lors de l'import des données

    /////////////////// Good relation ///////////////////

    // modelBook.belongsTo(modelCustomer, {
    //     foreignKey: "customers_id",
    // });

    // modelCustomer.hasMany(modelBook, {
    //     foreignKey: "customers_id",
    // });           

    /////////////////////////////////////////////////////

    // Un livre peut avoir plusieurs auteurs



    modelCategory.hasMany(modelBook, {
        foreignKey: "categories_id",
    });

    modelBook.belongsTo(modelCategory, {
        foreignKey: "categories_id",
    });

    modelBook.hasMany(modelComment, {
        foreignKey: "books_id",
    });

    modelComment.belongsTo(modelBook, {
        foreignKey: "books_id",
    });

    // modelBook.belongsToMany(modelAuthor, { through: modelWriting });
    // modelAuthor.belongsToMany(modelBook, { through: modelWriting });
};

const importCustomer = () => {
    dataCustomers.map((customer) => {
        bcrypt
            .hash(customer.mot_de_passe, 10)
            .then((hash) => {
                modelCustomer.create({
                    pseudo: customer.pseudo,
                    date_entree: customer.date_entree,
                    mot_de_passe: hash
                }).then((customer) => console.log(customer.toJSON()));
            })
    });
};
 // obtient le chemin du repertoire
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);
// obtient le chemin du dossier
const folderPath = path.join(_dirname, '../books');

const importBooks = (folderPath) => {
    // lis le dossier
    const files = fs.readdirSync(folderPath);
    // insère dans la db
    for(let i =0 ; i< files.length; i++){
        const filePath = path.join(folderPath,files[i]);
        console.log("jfbefb3f"+filePath)
        const epubFile = fs.readFileSync(filePath);
        console.log(epubFile)
        dataBooks.map((book) => {
            modelBook.create({
                price: book.price,
                title: book.title,
                epub:epubFile,
                image: book.image,
                categories_id: book.categories_id,
                customers_id: book.customers_id,
                authors_id: book.authors_id,
                page_count: book.page_count,
                summary: book.summary
            }).then((book) => console.log(book.toJSON()));
        });
    }
};

const importCategory = () => {
    dataCategory.map((category) => {
        modelCategory.create({
            category: category.category,
        }).then((category) => console.log(category.toJSON()));
    });
};

const importAuthor = () => {
    dataAuthor.map((author) => {
        modelAuthor.create({
            name: author.name,
            firstName: author.firstName,
            books_id: author.books_id,
        }).then((author) => console.log(author.toJSON()));
    });
};

const importComment = () => {
    dataComment.map((comment) => {
        modelComment.create({
            comment: comment.comment,
            books_id: comment.books_id,
            com_customers_id: comment.com_customers_id,
        }).then((comment) => console.log(comment.toJSON()));
    });
};

// const importWriting = () => {
//     dataWriting.map((writing) => {
//         modelWriting.create({
//             authors_id: writing.authors_id,
//             books_id: writing.books_id,
//         }).then((author) => console.log(author.toJSON()));
//     });
// };

export { sequelize,initDB, modelCustomer, modelBook, modelCategory, modelComment, modelAuthor };