const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: 'storage/images',
    filename: (req, file, cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage:storage
});

const formname = upload.array("product");

module.exports = {formname}

