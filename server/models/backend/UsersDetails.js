import { DataTypes } from "sequelize"
import Database from "../../config/Database.js"

const UsersDetails = Database.define("UsersDetails",{
    id:{
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true
    },
    profile: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "default.jpg"
    },
    profileUrl: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "http://localhost:8000/profile/default.jpg",
    },
    noHp: {
        type: DataTypes.STRING("13"),
        allowNull: false,
        defaultValue: "62",
    },
    alamat: {
        type: DataTypes.STRING("1000"),
        allowNull: false,
    },
    negara: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "Indonesia"
    },
    provinsi:{
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "Jawa Barat"
    },
    kota:{
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "Majalengka"
    },
    kecamatan:{
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "Majalengka"
    },
    kodePos: {
        type: DataTypes.STRING("500"),
        allowNull: false,
        defaultValue: "364643"
    },
    desc: {
        type: DataTypes.STRING("300"),
        allowNull: true,
    },
},{
    freezeTableName: true,
    paranoid: true
})


export default UsersDetails