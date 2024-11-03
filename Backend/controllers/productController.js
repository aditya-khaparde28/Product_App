const db = require('../db');

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, category_id } = req.body; // Changed to match database column name
  try {
    const [result] = await db.execute(
      'INSERT INTO products (name, category_id) VALUES (?, ?)', // Updated here
      [name, category_id] // Updated here
    );
    res.json({ id: result.insertId, name, category_id }); // Updated here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get paginated products with category details
exports.getPaginatedProducts = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const offset = (page - 1) * pageSize;
  
    console.log('Page:', page);
    console.log('Page Size:', pageSize);
    console.log('Offset:', offset);
    console.log('Parameter Types: Offset:', typeof offset, 'Page Size:', typeof pageSize);
  
    try {
      const [products] = await db.execute(
        `SELECT products.id AS ProductId, products.name AS ProductName, categories.name AS CategoryName, categories.id AS CategoryId
         FROM products
         JOIN categories ON products.category_id = categories.id
         LIMIT ?, ?`,
        [offset, pageSize]
      );
  
      const [countResult] = await db.execute('SELECT COUNT(*) AS count FROM products');
      const total = countResult[0].count;
  
      res.json({
        total,
        products,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize),
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
  
  
  

// Update a product
exports.updateProduct = async (req, res) => {
  const { name, category_id } = req.body; // Changed to match database column name
  const { id } = req.params;
  try {
    await db.execute('UPDATE products SET name = ?, category_id = ? WHERE id = ?', [ // Updated here
      name,
      category_id, // Updated here
      id,
    ]);
    res.json({ id, name, category_id }); // Updated here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
