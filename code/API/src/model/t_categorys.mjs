const CategoryModel = (sequelize, DataTypes) => {
    return sequelize.define(
        "Category",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                validate: {
                }
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "La catégorie ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "La catégorie est une propriété obligatoire.",
                    },
                }
            },
        },
        {
            timestamps: true,
            createdAt: "created",
            updatedAt: false,
        }
    );
};
export { CategoryModel };
