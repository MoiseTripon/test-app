module.exports = db => {
  return {
    create: async (req, res) => {
      try {
        const { cars, ...personData } = req.body;

        const person = await db.models.Person.create(personData);

        if (cars?.length) {
          await person.setCars(cars); 
        }

        res.send({ success: true });
      } catch (err) {
        res.status(401).send();
      }
    },

    update: async (req, res) => {
      try {
        const { id, cars, ...personData } = req.body;

        const person = await db.models.Person.findByPk(id);
        if (!person) return res.status(404).send({ error: 'Not found' });

        await person.update(personData);

        if (cars) {
          await person.setCars(cars); 
        }

        res.send({ success: true });
      } catch (err) {
        res.status(401).send();
      }
    },

    findAll: async (req, res) => {
      try {
        const people = await db.models.Person.findAll({
          include: [{ model: db.models.Car }]
        });

        res.send(people);
      } catch (err) {
        res.status(401).send();
      }
    },

    find: async (req, res) => {
      try {
        const person = await db.models.Person.findOne({
          where: { id: req.params.id },
          include: [{ model: db.models.Car }]
        });

        if (!person) return res.status(404).send({ error: 'Not found' });

        res.send(person);
      } catch (err) {
        res.status(401).send();
      }
    },

    destroy: async (req, res) => {
      try {
        await db.models.Person.destroy({ where: { id: req.params.id } });
        res.send({ success: true });
      } catch (err) {
        res.status(401).send();
      }
    }
  };
};