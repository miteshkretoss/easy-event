const usersRoutes = require('./routes/users'); // Import the user routes
const productsRoutes = require('./routes/products'); // Import the product routes

app.use('/users', usersRoutes); // Mount the user routes at /users
app.use('/products', productsRoutes); // Mount the product routes at /products