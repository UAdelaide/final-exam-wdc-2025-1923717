router.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT bl.BookID, bi.Title, u.Name AS SellerName, bl.SellerID
    FROM BookListings bl
    JOIN BookInfo bi ON bl.BookInfoID = bi.BookInfoID
    JOIN Users u ON bl.SellerID = u.UserID
  `);
  res.json(rows);
)});

app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await db.execute('SELECT * FROM Dogs WHERE ');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});