import React, { useEffect, useState,createContext } from 'react';
import {
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig';

// Import pages
import Layout from './partials/Layout';
import Posts from './pages/Posts';
import Tags from './pages/Tags';
import Categories from "./pages/Categories"
import Users from './pages/Users';
import Settings from './pages/Settings';
import Detail from './partials/posts/Detail';
import Add from './partials/posts/Add';
import Scrape from './partials/scrape/Scrape';
import Login from './pages/Login';

import { reducer, initValue,authContext } from './AuthContext';

function App() {

  const location = useLocation();
  const [user,setUser] = useState([])
  const [role,setRole] = useState([])
  const [state,dispatch] = React.useReducer(reducer,initValue)

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change
 

  return (
    
    <>
     <authContext.Provider value={{ state, dispatch }}>
      <Routes>
        <Route path="/" element={ "" } /> 
        <Route path="/login" element={ <Login setUser={ setUser } setRole={ setRole } /> } />
        <Route path="/register" element={ <Login /> } />
        <Route path="/api/dashboard" element={<Layout />} />

        {/* posts */}
        <Route path='/api/posts' 
          element={
            <Layout >
            <Posts />
            </Layout> 
          } 
        />
        <Route path='/api/posts/detail/:slug' 
          element={
            <Layout >
            <Detail />
            </Layout> 
          } 
        />
        <Route path='/api/posts/add' 
          element={
            <Layout >
            <Add />
            </Layout>
          } 
        />
        <Route path='/api/posts/edit/:slug' 
          element={
            <Layout >
            <Add />
            </Layout>
          } 
        />
        {/* end posts */}
        <Route path='/api/tags' 
          element={ 
            <Layout >
            <Tags />
            </Layout>
          } 
        />

        <Route path='/api/categories' 
          element={
            <Layout>
            <Categories />
            </Layout>
          }
        />

        <Route path='/api/users' 
          element={
            <Layout>
            <Users />
            </Layout>
          }
        />
        
        <Route path='/api/settings' 
          element={
            <Layout>
            <Settings />
            </Layout>
          }
        />
        <Route path='/api/tools/scrape' 
          element={
            <Layout>
            <Scrape />
            </Layout>
          }
        />


        <Route path='*' element={ <>404</>} />
      </Routes>
      </authContext.Provider>
    </>
  );
}

export default App;
