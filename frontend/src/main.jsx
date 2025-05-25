import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { Toaster } from "react-hot-toast";
import CssBaseline from '@mui/material/CssBaseline';

import './index.css'
import App from './App.jsx'

const store= configureStore({
    reducer: rootReducer,
});

createRoot(document.getElementById('root')).render(
  <Provider store = {store}>
   <BrowserRouter>
    <App />
    <Toaster/>
    <CssBaseline />
    </BrowserRouter>
  </Provider>,
)
