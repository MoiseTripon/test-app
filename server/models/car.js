module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Car', {
    brand_name: {
      type: DataType.STRING(255)
    },
    model_name: {
      type: DataType.STRING(255)
    },
    production_year: {
      type: DataType.INTEGER
    },
    engine_capacity: {
      type: DataType.INTEGER
    },
    tax: {
      type: DataType.INTEGER
    }
  }, {
    timestamps: true
  });

  model.associate = (models) => {
    model.belongsToMany(models.Person, {
      through: 'person_car',
      foreignKey: 'id_car',
      otherKey: 'id_person'
    });
  };

  return model;
};