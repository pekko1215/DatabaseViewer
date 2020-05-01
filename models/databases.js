'use strict';
module.exports = (sequelize, DataTypes) => {
    var databases = sequelize.define('databases', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        dbpath: DataTypes.STRING,
        name: DataTypes.STRING,
        comment: DataTypes.STRING,
        physicsName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return databases;
};