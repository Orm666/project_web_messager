import React, {Component, Suspense} from 'react';
import {BrowserRouter as Router, Route, Switch,} from "react-router-dom";
import Login from "./login";
import Registration from "./registration";
import Home from "./home";
import NotFound from './notFound';
import Messager from "./messager";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="Wrapper">
            <div className="wrapper_content">
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/" component={Home}/>

                        <Route exact path="/login" component={Login}/>

                        <Route exact path="/register" component={Registration}/>

                        <Route exact path="/messager" component={Messager}/>

                        <Route component={NotFound}/>

                    </Switch>
                </Suspense>
            </div>

        </div>)
    }
}

export default App;