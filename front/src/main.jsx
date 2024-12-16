import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux"
import {store} from './store/store'
import { BrowserRouter as Router} from 'react-router-dom'
import App from './App'
import { injectStoreApi } from "./api/api"

import { injectStoreHome } from './features/api/apiHomeSlice'

// injects
injectStoreApi(store)
injectStoreHome(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>    
  <Router >
    <App />
  </Router>
  </Provider>
);
