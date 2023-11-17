const db = require('../database/db');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const SECRETKEY = "NOTESAPI";
const nodemailer = require('nodemailer');



//get all user
const userlist = async (req, res) => {
    try {
        const sql = 'select * from user';
        await db.query(sql, (error, result) => {
            res.send(result)
        })
    } catch (error) {
        console.log(error)
    }
}


//user registration
const userregister = async (req, res) => {
    try {

        const { name, email, mobile, password } = req.body;

        const existingUser = "SELECT * FROM user WHERE email = ?"
        db.query(existingUser, [email], async (err, result) => {
            if (result.length > 0) {
                return res.json({ "Status": "Success", "message": "User already registered." })
            }

            else {

                const hashedPassword = await bcrypt.hash(password, 10);

                const insert = 'insert into user (name,email,mobile,password) values(?,?,?,?)';
                await db.query(insert, [name, email, mobile, hashedPassword], (error, result) => {
                    if (error) {
                        return res.json({ "Status": "Error", "message": error.sqlMessage });
                    }
                    if (result) {
                        mailsend(email,name)
                        const token = jwt.sign({ email: result.email, id: result.id }, SECRETKEY)
                        return res.status(201).json({ "Status": "Success", "message": "User Registered Successfully!", "token": token })
                        // res.json({ "status": "Success", "message": "User Register Successfully!" });
                    }
                });


            }

        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ "message": "Something went wrong" });
    }
}

//confirmation email for registration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mantosh.kumar@sapple.co.in',
        pass: 'feb@2022'
    }
});


async function mailsend(email,name) {

    await transporter.sendMail(mailOptions = {
        from: '"Mantosh Yadav"<mantosh.kumar@sapple.co.in>',
        to: `${email}`,
        subject: 'Registration Confirmation',
        // text: 'This is a test email sent from Nodemailer and Express.js.' 
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
        </head>
        
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #333;">Registration Confirmation</h2>
                <p>Hello ${name},</p>
                <p>Thank you for registering with our website. Please click the following link to confirm your registration:</p>
                <p style="text-align: center;">
                    <a href="[Confirmation Link]" style="text-decoration: none; background-color: #4caf50; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Confirm Registration</a>
                </p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>Mantosh Yadav</p>
            </div>
        
        </body>
        
        </html>`

    }, (error) => {
        if (error) {
            console.log("it has error", error)
        }
        else {
            console.log("Mail sent")
        }
    })

}




//user login 
const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginquery = "select * from user where email= ?";
        await db.query(loginquery, [email], async (error, result) => {

            if (error) {
                res.status(500).json({ "Status": "Error", "message": error.message })
                return
            }
            if (result.length < 1) {

                res.status(401).json({ "Status": "Error", "message": "User Doesn't Exist." })
                return
            }
            if (result.length > 0) {
                // console.log("length----->",result)

                const comparison = await bcrypt.compare(password, result[0].password)
                // console.log("compare", comparison)

                if (comparison) {
                    return res.status(201).json({ "Status": "Success", "message": "User Login Successfully!", "data": result })
                }

                else {
                    return res.json({ "Status": "Error", "message": "Invalid user email or password" });
                }

                // const user = result[0]
                // if (user.password == password) {
                //     res.status(201).json({ "Status": "Success", "message": "User Login Successfully!" })
                // }

            }
        })

    } catch (error) {
        console.log(error)

    }

}


//update user details
const updateuser = async (req, res) => {

    try {

        const userdetail = req.body;
        // console.log("user",userdetail)

        const sql = "UPDATE user SET name = ?, email = ?, mobile = ?, password = ? WHERE id = ?";
        db.query(sql, [userdetail.name, userdetail.email, userdetail.mobile, userdetail.password, userdetail.id], (error, result) => {
            if (error) {
                res.json({ "Status": "Error", "message": error.message })
            }

            if (result) {
                res.json({ "Stauts": "Success", "message": "Detail Updated Successfully!" })
            }

        })

    } catch (error) {

        console.log(error)

    }
}

//delete user
const deleteUser = (req, res) => {
    try {
        var user = req.body
        var sql = "DELETE FROM user WHERE id=?";
        db.query(sql, user.id, (err, result) => {
            if (err) {
                console.log(err)
            }

            res.json({ "status": "success", "message": "User Deleted Successfully" })
        })
    } catch (error) {

    }
}

//forgot password
const forgotPassword = async(req, res) => {
    try {

        var { email } = req.body
        console.log(email)
        var forgotquery = "SELECT * FROM user WHERE email=?";
        db.query(forgotquery,[email], async(error,result)=>{
            if(error){
                return res.status(500).json({"Status":"Error", "message":error.message})
            }

            if(result.length === 0){
                return res.status(400).json({"Status":"Error", "message":"User doesn't Exist"})
            }

            if(result.length>0){
                
                var name = result[0].name
                var password = result[0].password
                console.log(name,password)
                forgotmailsend(email,name,password)
                return res.status(200).json({"Status":"Success", "message":"Reset Password link shared on your eamil."})
            }

        })

    } catch (error) {

        console.log(error)

    }

}

//forgot passowrd email link

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mantosh.kumar@sapple.co.in',
        pass: 'feb@2022'
    }
});

async function forgotmailsend(email,name,password) {

    await transport.sendMail(mailOptions = {
        from: '"Mantosh Yadav"<mantosh.kumar@sapple.co.in>',
        to: `${email}`,
        subject: 'Forgot Password',
        // text: 'This is a test email sent from Nodemailer and Express.js.' 
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registration Confirmation</title>
        </head>
        
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #333;">Registration Confirmation</h2>
                <p>Hello ${name},</p>
                <p>Your password is mentioned below!</p>
                <p style="text-align: center;">
                <a href="http://localhost:4200/forgot-password" style="text-decoration: none; background-color: #4caf50; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold;">Click here</a>
                </p>
             
                <p>Best regards,<br>Mantosh Yadav</p>
            </div>
        
        </body>
        
        </html>`

    }, (error) => {
        if (error) {
            console.log("it has error", error)
        }
        else {
            console.log("Mail sent")
        }
    })

}






module.exports = { userlist, userregister, userlogin, updateuser, deleteUser,forgotPassword }