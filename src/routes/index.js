const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/products', async (req, res, next) => {
    try {
      const { tags } = req.query;
      const storeProducts = await productService.getProducts({ tags })
      res.status(200).json({
        data: storeProducts,
        message: 'products listed'
      });
    } catch (err) {
      console.log(err);
    }
  });

  // obtener producto por id
  router.get('/product/:productId', async(req, res, next) => {
    const { productId } = req.params;
    try {
      const product = await productService.getProduct({ productId });
      res.status(200).json({
        data: product,
        message: 'product retrieved'
      });
    } catch(err) {
      console.log('error', err);      
    }
  });

  // crear producto
  router.post('/create', async function(req, res, next) {
    const { body: product } = req;
    try {
      const createdProductId = await productService.createProduct({ product });
      res.status(201).json({
        data: createdProductId,
        message: 'product created'
      });
    } catch(err) {
      console.log('error', err);
    }
  });

  // actualizar producto
  router.put('/update/:productId', async function(req, res, next) {
    const { productId } = req.params;
    const { body: product } = req;

    try {
      const updatedProductId = await productService.updateProduct({ productId, product });
      res.status(200).json({
        data: updatedProductId,
        message: 'product updated'
      });
    } catch(err){
      console.log('error:', err);
    }
  });

  // eliminar producto
  router.delete('/delete/:productId', async function(req,res,next) {
    const { productId } = req.params;
    
    try {
      const deletedProductId = await productService.deleteProduct({ productId });
      res.status(200).json({
        data: deletedProductId,
        message: 'deleted product'
      });
    } catch(err) {
      console.log('error:', err);
    }
  });
  
  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;