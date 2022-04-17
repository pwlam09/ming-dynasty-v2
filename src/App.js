import './App.css';
import { HUD } from './features/HUD/HUD';
import { MainMenu } from './features/MainMenu/MainMenu';
import { useSelector } from 'react-redux';
import { GAME_LIST, MAIN_MENU } from './features/MainController/MainController.constants';
import { GAME_MATCH_THREE, GAME_PING_PONG } from './features/HUD/HUD.constants';
import { GameList } from './features/GameList/GameList';

function App() {
  const currentPage = useSelector(state => state.mainController.currentPage)

  return (
    <div className="App">
      {(currentPage === MAIN_MENU) ? <MainMenu /> : null}
      {(currentPage === GAME_LIST) ? <GameList /> : null}
      {(currentPage === GAME_PING_PONG) ? <HUD currentGame={GAME_PING_PONG} /> : null}
      {(currentPage === GAME_MATCH_THREE) ? <HUD currentGame={GAME_MATCH_THREE} /> : null}
    </div>
  );
}

export default App;
