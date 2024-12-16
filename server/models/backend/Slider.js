import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const Slider = Database.define("Slider",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        unique: true,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    desk: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "deskripsi role"
    },
    image: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "default.jpg"
    },
    imageUrl: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "http://localhost:8000/slider/default.jpg",
    },
},{
    freezeTableName: true,
    paranoid: true
})

export default Slider
