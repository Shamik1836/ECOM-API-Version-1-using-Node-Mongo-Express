const express = require('express');
const router=express.Router();
const {body} = require('express-validator');
const productController=require('../../../controllers/api/v1/product-controller')
router.post('/create',[
    body("name").not().isEmpty().withMessage("Name field cannot be empty"),
    body("quantity").isFloat({gt:0}).withMessage('Quantity cannot be 0')
],productController.createProduct);
router.get('/getAll',productController.getProduct);
router.patch('/:id',productController.updateProduct);
router.delete('/delete:id',productController.deleteProduct);
module.exports=router;