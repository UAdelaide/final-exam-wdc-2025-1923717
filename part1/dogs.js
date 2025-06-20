const { router } = require("./app");

router.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.query(`SELECT Dogs.name, Dogs.size
    FROM Dogs
    Join Users ON owner.username = Dogs.Owner.username`);
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});

