import { configureStore } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import userSlice from "../features/usersSlice"
import modalSlice from "../features/modalSlice"
import rolesSlice from "../features/rolesSlice"
import { apiSlice } from "../features/api/apiSlice"
import productsSlice from "../features/productsSlice"
import categoriesSlice from "../features/categoriesSlice"
import ordersSlice from "../features/ordersSlice"
import profileSlice from "../features/profileSlice"
import siteSlice from "../features/siteSlice"
import contactSlice from "../features/contactSlice"
import commentSlice from "../features/commentSlice"
import shoppingCartSlice  from "../features/shoppingCartSlice"
import sliderSlice from "../features/sliderSlice"
import packagedSlice from "../features/packagedSlice"
import shippingSlice from "../features/shippingSlice"
import rateItSlice from "../features/rateItSlice"
import sendEmailsSlice from "../features/sendEmaillsSlice"
import paymentsSlice from "../features/PaymentsSlice"
import homeSlice from "../features/homeSlice"
import notYetPaidSlice from "../features/notYetPaidSlice"
import cancelledSlice from "../features/cancelledSlice"
import contactOrdersSlice from "../features/contactOrdersSlice"
import discountsSlice from "../features/dicountsSlice"

export const store = configureStore({
    reducer: { 
        auth : authSlice,
        users : userSlice,
        modal: modalSlice,
        roles: rolesSlice,
        products: productsSlice,
        categories: categoriesSlice,
        orders: ordersSlice,
        profile: profileSlice,
        sites: siteSlice,
        contacts: contactSlice,
        comments: commentSlice,
        shoppingCart: shoppingCartSlice,
        sliders: sliderSlice,
        packaged: packagedSlice,
        rateIt: rateItSlice,
        shipping: shippingSlice,
        sendEmails: sendEmailsSlice, 
        payments: paymentsSlice,
        home: homeSlice,
        notYetPaid: notYetPaidSlice,
        contactOrders: contactOrdersSlice,
        cancelled: cancelledSlice,
        discounts:discountsSlice,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})