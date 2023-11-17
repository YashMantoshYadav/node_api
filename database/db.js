const mysql = require('mysql')
try {
    var conn =mysql.createPool({
        connectionLimit: 10,
        host: process.env.DBHOST,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
        database: process.env.DATABASE,
      
    });
} catch (error) {
    console.log("error----->",error)
}


conn.getConnection((err)=>{
    if(err){
        console.log("Connection Error",err)
    }
    else{
        console.log('Database Connected.');
    }
});

module.exports = conn