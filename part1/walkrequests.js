router.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [walkrequests] = await db.query(`SELECT Dogs.name, Dogs.size
    FROM Dogs
    Join Users ON owner.username = Dogs.Owner.username`);
    res.json(walkrequests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});

