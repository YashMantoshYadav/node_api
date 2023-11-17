const express = require('express');
const router = express.Router();
const controller = require('../controller/usercontroller');
const productController = require('../controller/product');
const { formname } = require('../middleware/fileupload_middleware');

//user routes
router.get('/user', controller.userlist);
router.post('/register', controller.userregister);
router.post('/login', controller.userlogin);
router.patch('/update', controller.updateuser);
router.delete('/delete', controller.deleteUser);
router.get('/forgot-password', controller.forgotPassword)


//product routes
router.get('/product', productController.productlist);
router.get('/productbyid', productController.product_by_id);
router.post('/addproduct', formname, productController.addproduct);
router.delete('/deleteproduct', productController.deleteproduct);






module.exports = router