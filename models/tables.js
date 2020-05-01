'use strict';
module.exports = (sequelize, DataTypes) => {
    var tables = sequelize.define('tables', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        databases: {
            type: DataTypes.INTEGER,
            references: {
                model: 'databases',
                key: 'id'
            }
        },
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
    return tables;
};