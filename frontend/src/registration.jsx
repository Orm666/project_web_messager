import React, {Component} from "react"
import {Redirect, Link} from "react-router-dom";

export default class Registration extends Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            username: "",
            password: "",
            email: "",
            logged: false
        }
    }

    handleClick(event) {
        event.preventDefault();

        this.setState({logged: false})

        fetch('/api/registration', {
            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                email: this.state.email
            })
        }).then(res => {
            res.json().then(data => {
                console.log(data)
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
                <h1>Registration</h1>

                <div className="input_text">

                    <input name="Username" type="text" placeholder="Username" onChange={e => {
                        this.setState({username: e.target.value})
                    }} value={this.props.value}/>

                </div>

                <div className="input_text">

                    <input name="Email" type="text" placeholder="Email" onChange={e => {
                        this.setState({email: e.target.value})
                    }} value={this.state.email}/>

                </div>

                <div className="input_text">

                    <input name="Password" type="password" placeholder="Password" onChange={e => {
                        this.setState({password: e.target.value})
                    }} value={this.state.password}/>

                </div>

                <div className="btn">
                    <button onClick={this.handleClick}>REGISTER</button>
                </div>


                <div className="bottom_text">
                    <p>Have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </form>)
    }
}