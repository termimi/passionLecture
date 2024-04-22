const WritingModel = (sequelize,DataTypes) => {
    return sequelize.define(
        "t_writing",
        {
            authors_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'Author',
                  key: 'id'
                }
              },
              books_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                  model: 'Book',
                  key: 'id'
                }
              }
        }
    );
};
export { WritingModel };