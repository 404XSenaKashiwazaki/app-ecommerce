// ================= import library // =================
import express from "express"
import cookieParser from "cookie-parser"
import env from "dotenv"
import bodyParser from "body-parser"
import Cors from "cors"
import passport from "./config/passport.js"
// ================= import library // =================

// ================= import routes backend // =================
import UsersRoute from "./routes/backend/UsersRoute.js"
import RolesRoute from "./routes/backend/RolesRoute.js"
import ContactRoute from "./routes/backend/ContactsRoute.js"
import CommentRoute from "./routes/backend/CommentsRoute.js"
import ProductRoute from "./routes/backend/ProductsRoute.js"
import CategorieRoute from "./routes/backend/CategoriesRoute.js"
import PaymentMethodRoute from "./routes/backend/PaymentsMethodsRoute.js"
import TableRoute from "./routes/backend/TablesRoute.js"
import ShopsRoute from "./routes/backend/ShopsRoute.js"
import ShopsOrdersRoute from "./routes/backend/ShopsOrdersRoute.js"
import SitesRoute from "./routes/backend/SitesRoute.js"
import SliderRoute from "./routes/backend/SlidersRoute.js"
import ShoppingCartsRoute from "./routes/backend/ShoppingCartsRoute.js"
import SendEemailRoute from "./routes/backend/SendEmaillRoute.js"
import ShopsPaymentsRoute from "./routes/backend/ShopsPaymentsRoute.js"
import DashboardRoute from "./routes/backend/DashboardRoute.js"
import DiscountsRoute from "./routes/backend/DiscountsRoute.js"
// ================= import routes backend // =================

// ================= import routes frontend // =================
import RajaOngkirRoute from "./routes/frontend/ApiRajaOngkirRoute.js"
import ProductsFrontRoute from "./routes/frontend/ProductsRoute.js"
import OrdersFrontRoute from "./routes/frontend/OrdersRoute.js"
import PaymentsFrontRoute from "./routes/frontend/PaymentsRoute.js"
import ShopsFrontRoute from "./routes/frontend/ShopsRoute.js" 
import ReservationsFrontRoute from "./routes/frontend/ReservationsRoute.js"
import TablesFrontRoute from "./routes/frontend/TablesRoute.js"
import PackagedRoute from "./routes/frontend/PackagedRoute.js"
import ShippingRoute from "./routes/frontend/ShippingRoute.js"
import RateItRoute from "./routes/frontend/RateItRoute.js"
import NotYetPaidRoute from "./routes/frontend/NotYetPaidRoute.js"
import CancelledRoute from "./routes/frontend/CancelledRoute.js"
import ContactsOrdersRoute from "./routes/frontend/ContactsOrdersRoute.js"
import ContactsFrontRoute from "./routes/frontend/ContactsRoute.js"
// ================= import routes frontend // =================

// ================= import routes auth // =================
import AuthRoute from "./routes/AuthRoute.js"
import RefreshTokenRoute from "./routes/RefreshTokenRoute.js"
import ProfileRoute from "./routes/ProfileRoute.js"
import GoogleAuthRoute from "./routes/GoogleAuthRoute.js"
// ================= import routes  auth // =================

// ================= import models // =================
import Database from "./config/Database.js"
// ================= import models // =================

// ================= import widdleware // =================
import CreateError from "./middleware/CreateError.js"
import { Comment, Contact, ContactOrders, ImageProducts, Orders, OrdersItem, Payments, Products, Reservations, Shops, Sites, Slider, Users, UsersDetails, Rating, Diskon } from "./models/Index.js"
import session from "express-session"

// ================= import middleware // =================

// ================= express // =================
env.config()
const app = express()
app.use(session({ secret: 'secretkey', resave: false, saveUninitialized: false }))
// ================= express // =================

// ================= passport // =================
app.use(passport.initialize())
app.use(passport.session())
// ================= passport // =================

// ================= cors akses url // =================
let whitelist = ['http://localhost:5173',"https://091b-103-166-158-39.ngrok-free.app"]
let corsOpt = function (req, callback) {
    let corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true ,credentials: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false, credentials: true } // disable CORS for this request
    }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
// ================= cors akses url // =================

// ================= db sync // =================
const _run =  () => {
    console.log("// ==================== APP-RES ==================== //")
    Database.query("SET FOREIGN_KEY_CHECKS = 0").then(async () =>{
    //    const users =  await Products.findOne({ where: { id: 1 } })
    //    const products = await users.getProducts()
    // await Products.destroy({ where: { UserId: [1]} })
    // await Promise.all(products.map(product => product.destroy()))
        // await Shops.sync({ force: true })
        // await UsersDetails.sync({force: true})
      
        // await Orders.sync({ force: true })
        // await Comment.sync({ force: true })
        // await OrdersItem.sync({ force: true })
        // await Payments.sync({ force: true })
        // await ContactOrders.sync({ force: true })
        // await Contact.sync({ force: true })
        // await Users.sync({ force: true})
        // await Products.sync({force:true})
        // await Rating.sync({  force: true })
        // await ImageProducts.sync({ force: true })
        // await User_Products.sync({ force: true })
        // await Reservations.sync({ force: true })
        // await Sites.sync({ force : true })
        // await Database.sync({ force: true }) 
        // await Userd.sync({ force: true })
        // await Comment.sync({ force: true })
        // await Diskon.sync({ force: true })
        // await Roles.sync({ force: true })
        // await User_Role.sync({ force: true })
        // await Slider.sync({ force: true })
    //   await FilesShares.sync({ force: true })
    })
    .catch(err=> console.log("ERROR SYNC DATABASE ", err))
    .finally(()=>{
      console.log("// ==================== APP-RES ==================== //")
    })
}

_run()
// ================= db sync // =================

// ================= express config // =================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(express.json())
app.use(Cors(corsOpt))
// ================= express config // =================

// ================= express config statis file// =================
app.use("/products",express.static("./public/products"))
app.use("/shops",express.static("./public/shops"))
app.use("/sites",express.static("./public/sites"))
app.use("/profile",express.static("./public/profile"))
app.use("/success",express.static("./public/success"))
app.use("/slider",express.static("./public/slider"))
// ================= express config statis file// =================

// ================= routes auth // =================
app.use("/api/",AuthRoute,GoogleAuthRoute)
// ================= routes auth // =================

// ================= routes backend // =================
app.use("/api/",
    UsersRoute,
    ProfileRoute,
    RolesRoute,
    ContactRoute,
    CommentRoute,
    ProductRoute,
    CategorieRoute,
    TableRoute,
    PaymentMethodRoute,
    ShopsRoute,
    ShopsOrdersRoute,
    SitesRoute,
    ProductRoute,
    OrdersFrontRoute,
    SliderRoute,
    ShoppingCartsRoute,
    ShippingRoute,
    PackagedRoute,
    RateItRoute,
    SendEemailRoute,
    ShopsPaymentsRoute,
    DashboardRoute,
    NotYetPaidRoute,
    CancelledRoute,
    RajaOngkirRoute,
    ContactsOrdersRoute,
    ProductsFrontRoute,
    DiscountsRoute,
    ContactsFrontRoute,
)

// ================= routes backend // =================

// ================= routes frontend // =================
app.use("/",
    ProductsFrontRoute,
    PaymentsFrontRoute,
    ShopsFrontRoute,
    ReservationsFrontRoute,
    TablesFrontRoute,
)
// ================= routes frontend // =================

// ================= routes refreshtoken // =================
app.use("/api",RefreshTokenRoute)
// ================= routes refreshtoken // =================

// ================= routes profile // =================
app.use("/",ProfileRoute)
// ================= routes profile // =================

// ================= middleware error // =================
app.use(CreateError)
// ================= middleware error // =================

// ================= express server // =================
app.listen(process.env.APP_PORT,()=>{
    console.log("Server runing in port "+process.env.APP_PORT)
    console.log("// ==================== APP-RES ==================== //")
    // console.log(Buffer.from("SB-Mid-server-ZnZ4O_4AlBZ-P9yh3kCjhB_o").toString("base64"));
    
})
// ================= express server // =================
