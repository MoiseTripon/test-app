module.exports = db => {
  return {
    create: async (req, res) => {
      try {
        const car = await db.models.Car.create(req.body);
        res.send({ success: true, id: car.id });
      } catch (err) {
        res.status(401).send();
      }
    },

    update: async (req, res) => {
      try {
        await db.models.Car.update(req.body, { where: { id: req.body.id } });
        res.send({ success: true });
      } catch (err) {
        res.status(401).send();
      }
    },

    findAll: async (req, res) => {
      try {
        const cars = await db.models.Car.findAll({
          include: [{ model: db.models.Person }]
        });
        res.send(cars);
      } catch (err) {
        res.status(401).send();
      }
    },

    find: async (req, res) => {
      try {
        const car = await db.models.Car.findOne({
          where: { id: req.params.id },
          include: [{ model: db.models.Person }]
        });

        if (!car) return res.status(404).send({ error: 'Not found' });

        res.send(car);
      } catch (err) {
        res.status(401).send();
      }
    },

    destroy: async (req, res) => {
      try {
        await db.models.Car.destroy({ where: { id: req.params.id } });
        res.send({ success: true });
      } catch (err) {
        res.status(401).send();
      }
    }
  };
};