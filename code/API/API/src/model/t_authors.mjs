const Authormodel = (sequelize, DataTypes) => {
    return sequelize.define(
        "Author",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                validate: {
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Le name ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le name est une propriété obligatoire.",
                    },
                }
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Le firstName ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le firstName est une propriété obligatoire.",
                    },
                }
            },
            books_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            timestamps: true,
            createdAt: "created",
            updatedAt: false,
        }
    );
};
export { Authormodel };