module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Person', {
    first_name: {
      type: DataType.STRING(255),
      allowNull: false
    },
    last_name: {
      type: DataType.STRING(255),
      allowNull: false
    },
    cnp: {
      type: DataType.STRING(13),
      allowNull: false
    },
    age: {
      type: DataType.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  model.associate = (models) => {
    model.belongsToMany(models.Car, {
      through: 'person_car',
      foreignKey: 'id_person',
      otherKey: 'id_car'
    });
  };

  return model;
};