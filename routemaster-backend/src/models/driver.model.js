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
            unique: true,
        },
        call_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('connect', "didn't connect", 'pending'),
            allowNull: true,
            defaultValue: 'pending',
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
            type: DataTypes.TEXT,
            allowNull: true,
        },
        max_weight_capacity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        average_rate: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        preferred_routes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            get() {
                const value = this.getDataValue('preferred_routes');
                return Array.isArray(value) ? value : [];
            },
            set(value) {
                this.setDataValue('preferred_routes', Array.isArray(value) ? value : []);
            },
        },
    }, {
        tableName: 'drivers',   // ✅ force lowercase table
        timestamps: true        // ✅ enable createdAt/updatedAt
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
