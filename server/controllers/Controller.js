const dbUsers = require('../db/users.json')
const fs = require('fs')

class Controller {
    static homePage (req, res) {
        res.send('home')
    }

    static register (req, res) {
        try {
            const {username, email, password} = req.body
            const dynamicId = dbUsers.length + 1

            let newData = {
                "id" : dynamicId,
                "username" : username,
                "email" : email,
                "password" : password
            }

            const usernameValidation = dbUsers.find(el => el.username == username)

            const emailValidation = dbUsers.find(el => el.email == email)

            if (usernameValidation && emailValidation) {
                throw new Error('Username dan email sudah terdaftar')
            } else if (usernameValidation) {
                throw new Error('Username tidak tersedia')
            } else if (emailValidation) {
                throw new Error('Email sudah terdaftar')
            } else {
                dbUsers.push(newData)
                const newDataString = JSON.stringify(dbUsers)

                fs.writeFileSync('./db/users.json', newDataString)

                function formatJsonFile(filePath) {
                    const jsonString = fs.readFileSync(filePath, 'utf8');
                    const jsonObj = JSON.parse(jsonString);
                    const formattedJsonString = JSON.stringify(jsonObj, null, 4);
                    fs.writeFileSync(filePath, formattedJsonString);
                }

                formatJsonFile('./db/users.json')
            }

            res.status(201).json(dbUsers)
        } catch (error) {
            console.log(error.message);
            res.status(500).json({"ERROR" : error.message})
        }
    }
}

module.exports = Controller