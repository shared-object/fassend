const { Sequelize, DataTypes } = require('sequelize')
const config = require('../../config.json')

const { database, username, password, host, dialect } = config.database


const sequelize = new Sequelize(database, username, password, {host, dialect})


sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error))

sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    key: {
        type: DataTypes.STRING(30),
        unique: true
    },

    token: {
        type: DataTypes.STRING,
        unique: true
    },

    data: {
        type: DataTypes.BLOB
    }
    
}, {tableName: 'files',sequelize})

sequelize.sync({force: false})

module.exports = sequelize
