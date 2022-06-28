const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProduct);

router.post('/', productController.createNewProduct);

router.put('/:id', productController.updateProduct); 

router.delete('/:id', productController.deleteProduct);


module.exports = router;