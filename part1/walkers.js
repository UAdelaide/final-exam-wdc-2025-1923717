
router.get('/api/walkers/summary', async (req, res) => {
  try {
    const [walkers] = await db.query(`SELECT Dogs.name, Dogs.size
    FROM Dogs
    Join Users ON owner.username = Dogs.Owner.username`);
    res.json(walkers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});

