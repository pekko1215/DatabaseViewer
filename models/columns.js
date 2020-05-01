'use strict';
module.exports = (sequelize, DataTypes) => {
    var columns = sequelize.define('columns', {
        tables: {
            type: DataTypes.INTEGER,
            references: {
                model: 'tables',
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
    return columns;
};