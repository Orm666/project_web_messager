import React, {Component} from "react"
import {Link} from "react-router-dom";

export default class Home extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div className="content">

                <h1>Hi!))))</h1>
                <div className={"header"}>
                    <Link to={'/login'}>LOGIN</Link>
                    <Link to={'/register'}>REGISTER</Link>
                    <Link to={'/messager'}>MESSAGER</Link>
                </div>

            </div>
        )
    }
}