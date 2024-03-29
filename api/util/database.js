const DBSOURCE = "db.sqlite"
var sqlite3 = require('sqlite3');
var md5 = require('md5')

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                    console.log(err)
                } else {
                    // Table just created, creating some rows
                    var insert = `INSERT INTO user (name, email, password) VALUES (?,?,?)`;
                    db.run(insert, ["admin", "admin@gmail.com", md5('123456')]);
                    db.run(insert, ["user", "user@gmail.com", md5("123456")]);
                    db.run(insert, ["test", "test@gmail", md5("pass")]);
                    
                }
            });

        }
});


module.exports = db