const CustomerModel = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        validate: {
        },
      },
      pseudo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Ce username est déjà pris." },
        validate: {
          isAlphanumeric: {
            args: true,
            msg: "Veuillez utiliser uniquement des lettres et des chiffres pour le pseudo",
          },
          notNull: {
           msg: "Le pseudo est un champs obligatoire"
          },
          notEmpty: {
            msg: "Le pseudo ne peut pas être vide"
          }
        },
      },
      date_entree: {
        type: DataTypes.DATE,
        allowNull: false,

      },
      mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
           msg: "Le mot de passe est un champs obligatoire"
          },
          notEmpty: {
            msg: "Le mot de passe ne peut pas être vide"
          }
        },
      },
    },
    
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
  return Customer;
};
export { CustomerModel };
