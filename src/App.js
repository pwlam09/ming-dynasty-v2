import logo from './logo.svg';
import './App.css';
import { HUD } from './features/HUD/HUD';
import { MainMenu } from './features/MainMenu/MainMenu';

function App() {
  return (
    <div className="App">
      <MainMenu />
      {/* <HUD /> */}
    </div>
  );
}

export default App;
