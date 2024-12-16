import { DataTypes } from "sequelize"
import sequelize from "../../config/Database.js"

const Rating = sequelize.define("Rating",{
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        },
        defaultValue: 1
    },
    review: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: ""
    }
},{
    freezeTableName: true,
    paranoid: true
})

export default Rating






