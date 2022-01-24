import './main.css';

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import MenuBar from './components/MenuBar';

import Home from './pages/home';
import Quiz from './pages/quiz';
import History from './pages/history';

function App() {
    return (
        <div className="App">
            <Router>
                <div className="container">
                    <MenuBar />
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/quiz" component={Quiz} />
                    <Route exact path="/history" component={History} />
                </div>
            </Router>
        </div>
    );
}

export default App;
