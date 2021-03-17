import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            username: "",
            password: "",
            logged: false
        }
    }

    handleClick(event) {
        event.preventDefault();

        fetch('/api/users', {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(res => {

            res.json().then(data => {
                if (data.error) {
                    console.error(data.error)
                    this.setState({logged: false})
                } else {
                    this.setState({logged: true})
                }
            }).catch(e => {
                console.error((e))
            })
        }).catch(e => {
            console.error((e))
        })
    }

    render() {
        if (this.state.logged) {
            return <Redirect to={"/messager"}/>
        }
        return (
            <form className="input_form">
                <h1>Login</h1>

                <div className="input_text">

                    <input name="Username" type="text" placeholder="Username" onChange={e => {
                        this.setState({username: e.target.value})
                    }} value={this.props.value}/>

                </div>

                <div className="input_text">

                    <input name="Password" type="password" placeholder="Password" onChange={e => {
                        this.setState({password: e.target.value})
                    }} value={this.state.password}/>

                </div>

                <div className="btn">
                    <button onClick={this.handleClick}>LOG IN</button>
                </div>


                <div className="bottom_text">
                    <p>Don't have account? <Link to="/register">Sign up</Link></p>
                </div>
            </form>)
    }
}