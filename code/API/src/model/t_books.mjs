const BookModel = (sequelize, DataTypes) => {
    const Book = sequelize.define(
        "Book",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                validate: {}
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    isFloat: {
                        msg: "Utilisez uniquement des nombres pour le prix.",
                    },
                    notEmpty: {
                        msg: "Le prix ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le prix est une propriété obligatoire.",
                    },
                },

            },
            epub: {
                type: DataTypes.BLOB('long'),
                allowNull: true,
                validate: {
                },
 
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Le nom ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le nom est une propriété obligatoire.",
                    },
                },
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "L'image ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "L'image est une propriété obligatoire.",
                    },
                }
            },
            categories_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            customers_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            authors_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            page_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isFloat: {
                        msg: "Utilisez uniquement des nombres pour le nombre de pages.",
                    },
                    notEmpty: {
                        msg: "Le nombres de pages ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le nombres de pages est une propriété obligatoire.",
                    },
                }
            },
            summary: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Le somaire ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le somaire est une propriété obligatoire.",
                    },
                }
            },

        },
        {
            timestamps: true,
            createdAt: "created",
            updatedAt: false,

            //Permet le debug en créeant la fk manuellement dans phpmyadmin
            indexes: [
                {
                    unique: false,
                    fields: ['customers_id']
                }
            ],
        }
    );

    return Book;
};

export { BookModel };
