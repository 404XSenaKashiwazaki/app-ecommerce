
import Users, { User_Role } from "./backend/Users.js"
import Roles from "./backend/Roles.js"
import Products from "./backend/Products.js"
import Orders from "./front/Orders.js"
import Comment from "./backend/Comment.js"
import Contact from "./backend/Contact.js"
import ImageProducts from "./backend/ImageProducts.js"
import Tables from "./backend/Tables.js"
import Reservations from "./front/Reservations.js"
import Payments from "./front/Payments.js"
import Category from "./backend/Categories.js"
import UsersDetails from "./backend/UsersDetails.js"
import PaymentsMethods from "./backend/PaymentMethods.js"
import Shops from "./backend/Shops.js"
import Sites from "./backend/Sites.js"
import sequelize from "../config/Database.js"
import Slider from "./backend/Slider.js"
import Rating from "./front/Rating.js"
import { DataTypes, Sequelize } from "sequelize"
import Diskon from "./backend/Diskon.js"

const OrdersItem = sequelize.define("OrdersItems",{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    quantity: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.STRING
    },
    // total_price: {
    //     type: DataTypes.STRING
    // },
    order_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("NOW")
    },
    OrderId: {
        type: DataTypes.BIGINT,
        references: {
            model: Orders,
            key: "id",
            
        },
    },
    ProductId: {
        type: DataTypes.BIGINT,
        references: {
            model: Products,
            key: "id"
        },
    },
},{
    freezeTableName: true,
    paranoid: true,
    hooks: {
        afterBulkCreate: i => {
            i.map(async (item, indx) => {
            
            
                // await Products.decrement("stok_produk",{ by: item.quantity, where: { id: item.ProductId } })
            })
        },
        beforeBulkDestroy: async i => {
            const orderItem = await OrdersItem.findAll({  where: {  OrderId: i.where.OrderId}, paranoid: false})
            console.log("sakgfosdgjdfijhdfkd",orderItem);
                orderItem.map(async (item, indx) => {
                    console.log(item);
                    
                    await Products.increment("stok_produk",{ by: item.quantity, where: { id: item.ProductId } }) //Bug masih bisa di-increment produk, padahal order sudah dihapus
                })
                // console.log(i);
                
        }
    }

})

const ContactOrders = sequelize.define("ContactOrders", {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING("100"),
        allowNull: false,
        defaultValue: "your_email@gmail.com",
    },
    username: DataTypes.STRING(50),
    profileUrl: {
        type: DataTypes.STRING("500"),
        allowNull: true,
        defaultValue: null
    },
    content: {
        type: DataTypes.STRING(200),
        defaultValue: "",
        allowNull: true
    },
    transactionId:{
        type: DataTypes.UUID,
        references: {
            model: Orders,
            key: "transactionId"
        }
    },
    tanggapan: {
        type: DataTypes.STRING(200),
        defaultValue: "",
        allowNull: true
    },
},{ 
    freezeTableName: true,
    paranoid: true
})


Users.belongsToMany(Roles,{through: User_Role, onDelete: "CASCADE"})
Roles.belongsToMany(Users,{through: User_Role })

Users.hasOne(UsersDetails,{ onDelete: "CASCADE" })
UsersDetails.belongsTo(Users)


Products.hasMany(Comment,{ onDelete: "CASCADE" })
Comment.belongsTo(Products)

Users.hasMany(Contact,{ onDelete: "CASCADE"})
Contact.belongsTo(Users)

Contact.hasMany(Contact,{ onDelete: "CASCADE", foreignKey: "ContactId" })
Contact.belongsTo(Contact,{ foreignKey: "ContactId" })

Diskon.hasMany(Products,{ onDelete: "SET NULL" })
Products.belongsTo(Diskon)

// casecade di tabel induk
Users.hasMany(Products,{  onDelete: "CASCADE" })
Products.belongsTo(Users)

Products.hasMany(ImageProducts,{ onDelete: "CASCADE" })
ImageProducts.belongsTo(Products)

OrdersItem.hasOne(Rating,{ onDelete: "CASCADE" })
Rating.belongsTo(OrdersItem)

Category.hasMany(Products,{ onDelete: "SET NULL"})
Products.belongsTo(Category)

Users.hasMany(Orders,{ onDelete: "CASCADE"})
Orders.belongsTo(Users)

Orders.belongsToMany(Products,{ through: OrdersItem , foreignKey: "OrderId" , uniqueKey: false})
Products.belongsToMany(Orders,{ through: OrdersItem, foreignKey: "ProductId", uniqueKey: false })

Orders.hasOne(Payments,{ foreignKey: {
    type: DataTypes.UUID,
    name: "transactionId",
}, sourceKey: "transactionId",onDelete: "CASCADE" })
Payments.belongsTo(Orders,{ foreignKey: "transactionId", targetKey: "transactionId" })

Orders.hasMany(ContactOrders, { foreignKey: {
    type: DataTypes.UUID,
    name: "transactionId",
}, sourceKey: "transactionId",onDelete: "CASCADE" })
ContactOrders.belongsTo(Orders,{ foreignKey:"transactionId", targetKey: "transactionId" })

Shops.hasMany(Tables,{ onDelete: "CASCADE" })
Tables.belongsTo(Shops)

Tables.belongsToMany(Users,{ through: Reservations })
Users.belongsToMany(Tables,{ through: Reservations })

// PaymentsMethods.hasMany(Payments,{  onDelete: "CASCADE" })
// Payments.belongsTo(PaymentsMethods)

export {  
    Users, 
    Roles, 
    Products, 
    User_Role, 
    UsersDetails, 
    Contact,
    Comment, 
    ImageProducts,
    Category,
    Orders,
    OrdersItem,
    Tables,
    Reservations,
    Payments,
    PaymentsMethods,
    Shops,
    Sites,
    Slider,
    ContactOrders,
    Rating,
    Diskon,
}
