const db = require('../database/db')


//get all product list
const productlist = async (req, res) => {
    try {
        const sql = "SELECT * from product";

        await db.query(sql, (err, result) => {
            if (!err) {
                res.json(result)
            }
            else
            {
                res.json(err)
            }

        })

    } catch (error) {

    }
}

//fetch product by id
const product_by_id = async (req, res) => {
    try {
        var { id } = req.body;
        // console.log(id)
        const sql = "SELECT * FROM product WHERE productid=?";
        await db.query(sql, [id], (err, result) => {
            if (!err && result.length > 0) {
                res.json(result)
            }
            else if (result.length < 1) {
                res.json({ "Status": "Failed", "message": "Item not found" });
            }
            else {
                res.json(err)
            }


        })

    } catch (error) {

    }
}


//add new product

const addproduct = async (req, res) => {
    try {
console.log(req.files[0])
        const productimg = req.files[0].filename;
        var product = req.body;

        const sql = "INSERT INTO product (productname,price,description,color,productimage) VALUES (?,?,?,?,?)";
        db.query(sql, [product.productname, product.price, product.description, product.color, productimg ], async (err, result) => {

            if (!err) {

                return res.json({ "Status": "Success", "message": "Product added successfully!" });
            }

            else {
                return res.json({ "Status": "Error", "message": err.message });
            }

        });

    } catch (error) {

        return res.status(500).json({ "Status": "Error", "message": "Internal Server Error" });
    }
}

//delete product

const deleteproduct = async (req, res) => {

    try {
        const { id } = req.body;
        const sql = "DELETE FROM product WHERE productid=?";
        await db.query(sql, [id], (err, result) => {

            if (!err && result.affectedRows > 0) {
                res.json({ "Status": "Success", "message": "Item Deleted" });
                // res.json(result)

            }
            else if (result.affectedRows < 1) {
                res.json({ "Status": "Failed", "message": "Item not available" })
            }

            else {
                res.json({ "Status": "Error", "message": "Something went wrong" });
            }

        })
    } catch (error) {

    }
}



module.exports = { productlist, addproduct, product_by_id, deleteproduct }