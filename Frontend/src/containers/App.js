import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Parent from "./Parent";

function App() {



  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
     <Parent/>
    </div>
  );
}

export default App;
