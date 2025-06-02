import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Driver = sequelize.define('Driver', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure no duplicate phone numbers
        },
        call_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('connect', "didn't connect", 'pending'),
            allowNull: true,
            defaultValue: 'pending', // Add a default status
        },
        covered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        connect_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        didnt_connect_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        current_location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        next_location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_from_rigz: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },
        rigz_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        notes: {
            type: DataTypes.TEXT, // Changed from STRING to TEXT for multiline notes
            allowNull: true,
        },
        max_weight_capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        average_rate: {
            type: DataTypes.DECIMAL(10, 2), // Specify precision and scale
            allowNull: true,
        },
        preferred_routes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [], // Ensure an empty array by default
            get() {
                const value = this.getDataValue('preferred_routes');
                return Array.isArray(value) ? value : [];
            },
            set(value) {
                this.setDataValue('preferred_routes', Array.isArray(value) ? value : []);
            },
        },
    }, {
        tableName: 'drivers',
        timestamps: true,
    });

    Driver.associate = (models) => {
        Driver.hasMany(models.Load, {
            foreignKey: 'driver_rigz_id',
            sourceKey: 'rigz_id',
            as: 'loads',
        });
    };

    return Driver;
};