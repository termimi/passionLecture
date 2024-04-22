const CommentModel = (sequelize, DataTypes) => {
    return sequelize.define(
        "Comment",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                validate: {
                }
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "Le comment ne peut pas être vide.",
                    },
                    notNull: {
                        msg: "Le comment est une propriété obligatoire.",
                    },
                }
            },
            books_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            com_customers_id: {
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
export { CommentModel };