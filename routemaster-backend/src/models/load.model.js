import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Load = sequelize.define('Load', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        covered: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        didnt_connect_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('open', 'assigned', 'booked', 'cancelled'),
            allowNull: false,
            defaultValue: 'open',
        },

        assignedAt: DataTypes.DATE,
        completedAt: DataTypes.DATE,

        reference_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false, // make sure it's not required to be unique unless needed
        },

        company: {
            type: DataTypes.STRING,
            allowNull: false,
        },


        // ✅ CONTACTED FIELDS
        contacted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        contactedAt: DataTypes.DATE,
        contact_method: {
            type: DataTypes.STRING,
        },
        worked_with_us_before: DataTypes.STRING, // 'yes' / 'no' as string

        broker_name: DataTypes.STRING,
        email: DataTypes.STRING,
        call_count: DataTypes.INTEGER,
        rate: DataTypes.INTEGER,

        from_location: DataTypes.STRING,
        to_location: DataTypes.STRING,
        total_pounds: DataTypes.INTEGER,

        pickup_places: DataTypes.JSONB,
        delivery_places: DataTypes.JSONB,
        pickup_time: DataTypes.JSONB,
        delivery_time: DataTypes.JSONB,

        pickup_count: DataTypes.INTEGER,
        delivery_count: DataTypes.INTEGER,
        total_distance: DataTypes.INTEGER,

        fcfs: DataTypes.BOOLEAN,

        type: {
            type: DataTypes.ENUM('Van', 'Dry', 'Reefer', 'Van or Reefer'),
        },
        driver_rigz_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'drivers',
                key: 'rigz_id',
            },
        },
        comments: DataTypes.TEXT,
        price_bought: DataTypes.DECIMAL,
        price_sold: DataTypes.INTEGER,
        notes: DataTypes.STRING,
    }, {
        tableName: 'loads',
        timestamps: true,
    });

    Load.associate = (models) => {
        Load.belongsTo(models.Driver, {
            foreignKey: 'driver_rigz_id',
            targetKey: 'rigz_id',
            as: 'driver',
        });
    };

    return Load;
};
