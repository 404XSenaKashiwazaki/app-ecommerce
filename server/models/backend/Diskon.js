import { DataTypes } from "sequelize"
import sequelize from "../../config/Database.js"

const Diskon = sequelize.define("Diskon",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    diskon: {
        type: DataTypes.STRING,
        defaultValue: 5,
    },
    tanggal_mulai:{
        type: DataTypes.DATE(),
        defaultValue: DataTypes.NOW(),
        allowNull: false,
    },
    tanggal_berakhir:{
        type: DataTypes.DATE(),
        defaultValue: null,
        allowNull: true,
    },
    deskripsi: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
    }
},{
    freezeTableName: true,
    paranoid: true
})

export default Diskon