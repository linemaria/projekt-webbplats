import React from 'react'
import './App.css'
import Get from './Get'
// Funktionell component
const App = () => {
  //Framställ "App" component
  return(
    <>
    <header>

    <img className="logo" src="./skidiary.png" alt="logo"/>

   </header>
   <div id="postWrapper">
     <div id="mainContent">
 
   <div>
    <Get/>
    </div>
 <footer> Ⓒ Line Asp / Final Project DT162G </footer>
   </div>        
  
    </div>

    </>
  )
}
  
export default App