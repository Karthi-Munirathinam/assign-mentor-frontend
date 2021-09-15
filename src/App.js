import Appbar from './components/Appbar';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Createuser from './components/Createuser';
import Assignmentor from './components/Assignmentor';
import Homepage from './components/Homepage';
import Changementor from './components/Changementor';

function App() {
  return (
    <Router>
      <div className="App">
        <Appbar />
        <Switch>
          <Route path="/createuser" exact>
            <Createuser />
          </Route>
          <Route path="/assignmentor" exact>
            <Assignmentor />
          </Route>
          <Route path="/changementor" exact>
            <Changementor />
          </Route>
          <Route path="/" exact>
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
