// models/doNotCall.model.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const DoNotCallList = sequelize.define('DoNotCallList', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        broker_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        added_from: {
            type: DataTypes.ENUM('auto', 'manual'),
            defaultValue: 'auto',
        },
    }, {
        tableName: 'do_not_call_list',
        timestamps: true,
    });

    return DoNotCallList;
};
