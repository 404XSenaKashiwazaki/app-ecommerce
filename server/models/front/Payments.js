import { DataTypes, Sequelize } from "sequelize"
import sequelize from "../../config/Database.js"
import Orders from "./Orders.js"

const Payments = sequelize.define("Payments",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    amount: {
        type: DataTypes.STRING
    },
    bill_amount:{
        type: DataTypes.STRING,
    },
    return_amount:{
        type: DataTypes.STRING,
    },
    payment_method: {
        type: DataTypes.STRING,
    },
    payment_date: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
    },
    transactionId:{
        type: DataTypes.UUID,
        references: {
            model: Orders,
            key: "transactionId"
        }
    },
    va_numbers: {
        type: Sequelize.JSON
    },
    status:{
        type: DataTypes.STRING,
    }
},{
    freezeTableName: true,
    paranoid: true,
    hooks: {
        afterUpsert: async (i,o)=> {
            // await Orders.update({ status: "Prepared"},{ where: { id: o.orderid } })
        }
    }
})

// foreign key
// orderid
export default Payments