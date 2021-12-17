import Feed from "./components/Feed";
import Create from "./components/Create";
import Particles from 'react-tsparticles';

import './App.css';

const BACKGROUND_OPTIONS = {
  particles: {
    color: {
      value: '#F48120'
    },
    links: {
      color: '#F48120',
      distance: 250,
      enable: true,
      opacity: 1,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "out",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 3000,
      },
    },
    size: {
      value: 7,
    },
  }
};

function App() {
  return (
    <div className="app">
      <Particles
        options = {BACKGROUND_OPTIONS}
      />
      <h1 className="header">
        FlareGraph
      </h1>
      <Feed />
      <Create />
    </div>
  );
}

export default App;
