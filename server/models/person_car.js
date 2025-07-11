module.exports = (sequelize, Sequelize) => {
  const PersonCar = sequelize.define('person_car', {
    id_person: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Person',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    id_car: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Car',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: false
  });

  return PersonCar;
};