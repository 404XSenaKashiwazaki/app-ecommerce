import React, { useEffect, useState } from 'react';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';


import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Layout from './partials/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Users from './pages/Users';
import DetailUser from './partials/users/Detail';
import Categories from './pages/Categories';
import Authorization from './Authorization';

import Roles from './pages/Roles';

import Profile from './pages/Profile';
import ProfileFront from './pages/ProfileFront';

import About from './pages/About';
import Contact from './pages/Contact';
import Dmca from './pages/DmcaHome';
import Contact_ from './pages/Contact_';
import PrivacyPolice from './pages/PrivacyPoliceHome';
import Sites from './pages/Sites';
import Comment from './pages/Comment';

import Products from './pages/Products';
import AuthorizationFront from './AuthorizationFront';
import ProductsDetail from './pages/ProductsDetail';
import Orders from './pages/Orders';
import CheckOutPage from './pages/Checkout';
import ShoppingCart from './pages/ShoppingCart';
import OrderSuccess from './pages/OrderSuccess';
import Payments from './pages/Payments';
import PaymentConfirm from './pages/PaymentConfirm';
import NotYetPaid from './pages/NotYetPaid';
import Packaged from './pages/Packaged';
import Shipping from './pages/Shipping';
import Cancelled from './pages/Cancelled';
import RateIt from './pages/RateIt';
import LoginPage from "./partials/auth/Login"
import RegisterPage from "./partials/auth/Register"
import ForgotPasswordPage from "./partials/auth/ForgotPassword"
import Discounts from './pages/Discounts';
import ResetPassword from './partials/auth/ResetPassword';
import VerifyEmail from './partials/auth/VerifyEmail';
import { useFindSiteQuery } from './features/api/apiSitesSlice';
import { setSites } from './features/siteSlice';
import { useDispatch } from 'react-redux';

function App() {
  const { data:dataSite } = useFindSiteQuery()
  const [site, setSite ] = useState()
  const dispatch = useDispatch()
  const location = useLocation()
  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  useEffect(() => {
    if(dataSite?.response?.sites) {
      setSite({
        id: dataSite.response.sites.id,
        title: dataSite.response.sites.title,
        deskripsi: dataSite.response.sites.about,
        dmca: dataSite.response.sites.dmca,
        privacy_police: dataSite.response.sites.privacy_police,
        logo: dataSite.response.sites.logo,
        logo_url: dataSite.response.sites.logo_url
      }) 
      localStorage.setItem("sites",dataSite.response.sites.title)
    }
  },[dataSite])

  useEffect(() =>{
    if(site) dispatch(setSites(site))
  },[ site ])

  if(!site) return <></>
  return (
    
    <>
    
      <Routes>
      {/* api login */}
      <Route path="/login" element={ <LoginPage site={site?.title}/> }  />
      <Route path="/register" element={ <RegisterPage site={site?.title}/> }  />
      <Route path="/forgot-password" element={ <ForgotPasswordPage site={site?.title}/> }  />
      <Route path="/reset-password" element={ <ResetPassword site={site?.title}/> }  />
      <Route path="/verify-email" element={ <VerifyEmail site={site?.title}/> }  />
      {/* api login */}

      <Route path="/" element={ <AuthorizationFront /> } >
        <Route path="" element={<Layout />} >
        <Route path="/" element={<Home site={site?.title}/>} /> 
        <Route path="/home" element={<Home site={site?.title}/>} /> 
        <Route path="/products/:slug" element={<ProductsDetail site={site?.title}/> } />     
        <Route path="/checkouts/:username" element={<CheckOutPage site={site?.title}/> } />  
        <Route path="/about" element={<About site={site?.title}/>}></Route>
        <Route path="/contact" element={<Contact site={site?.title}/>}></Route>
        <Route path="/dmca" element={<Dmca site={site?.title}/>}></Route>
        <Route path="/cart/:username" element={<ShoppingCart site={site?.title}/>} />
        <Route path="/profile/:username" element={<Profile site={site?.title}/>} />
        <Route path="/profile/:username/orders/:id" element={<Profile site={site?.title}/>} />
        <Route path="/orders/:username/belum-bayar" element={<NotYetPaid site={site?.title}/>} />
        <Route path="/orders/:username/dikemas" element={<Packaged site={site?.title}/>} />
        <Route path="/orders/:username/dikirim" element={<Shipping site={site?.title}/>} />
        <Route path="/orders/:username/dibatalkan" element={<Cancelled site={site?.title}/>} />
        <Route path="/orders/:username/selesai" element={<RateIt site={site?.title}/>} />
        <Route path="/order/success/:transactionId" element={<OrderSuccess site={site?.title}/>}/>
        <Route path="/order/payment-confirm/:transactionId" element={<PaymentConfirm site={site?.title}/>}/>
        <Route path="/privacy-police" element={<PrivacyPolice site={site?.title}/>}></Route>
        <Route path='*' element={ <NotFound site={site?.title}/>} />
        </Route>
      </Route>

      <Route path='/api' element={ <Authorization /> } >
        <Route path="" element={ <Layout /> }>
          {/* dahboard */}
          <Route path="dashboard" element={<Dashboard site={site?.title}/>} />
          {/* users */}
          <Route path="users" element={ <Users site={site?.title}/>} />
          {/*  dsicounts */}
          <Route path="discounts" element={<Discounts site={site?.title}/>} />
          {/* users */}
          <Route path="users/detail/:id" element={ <DetailUser site={site?.title}/> } />
          {/*  roles */}
          <Route path="roles" element={<Roles site={site?.title}/>} />
          {/* products */}
          <Route path="products" element={<Products site={site?.title}/>} />
          <Route path="orders" element={<Orders site={site?.title}/>} />
          <Route path="transactions" element={<Payments site={site?.title}/>} />
          {/* settings */}
          <Route path="profile/:username" element={<Profile site={site?.title}/>} />
          {/* account */}
          <Route path="site" element={<Sites site={site?.title}/>} />
          <Route path="contact" element={<Contact_ site={site?.title}/>} />
          <Route path="comment" element={<Comment />} />
          {/* not found */}
          <Route path='*' element={ <NotFound site={site?.title}/>} />
        </Route>
      </Route>
      
    </Routes>
    
    </>
  );
}

export default App;
