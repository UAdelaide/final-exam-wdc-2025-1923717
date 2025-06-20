router.get('/api/dogs', async (req, res) => {
    try {}
  const [rows] = await db.query(`
    SELECT bl.BookID, bi.Title, u.Name AS SellerName, bl.SellerID
    FROM BookListings bl
    JOIN BookInfo bi ON bl.BookInfoID = bi.BookInfoID
    JOIN Users u ON bl.SellerID = u.UserID
  `);
  res.json(rows);
});

app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.query(`SELECT Dogs.name, Dogs.size
    FROM Dogs
    Join User ON `);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});