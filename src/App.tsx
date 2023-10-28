import React from 'react';
import AppRoutes from './router/routes.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from "./components/Footer.tsx";
function App() {

  return (
    <React.Fragment>
      <div id="App">
        <Navbar />
        <AppRoutes />
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default App
