const db = require('../config/sql');

exports.getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM products');
  return rows;
};
