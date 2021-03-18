import React, {Component} from "react"
import NewChat from "./NewChat";
import {Redirect} from "react-router-dom";

export default class Messager extends Component {


    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            username: "",
            connect: false,
            logged: undefined
        }
    }

    componentDidMount() {
        this.update()
    }

    update() {
        fetch('/api/users', {
            method: "get",
            headers: {'Content-Type': 'application/json'},
        }).then(res => {

            res.json().then(data => {
                if(data.error) {
                    console.error("ERROR")
                    this.setState({
                        connect: false,
                        logged: false
                    })
                } else {
                    this.setState({
                        connect: false,
                        logged: true
                    })
                }
            }).catch(e => {
                console.error((e))
                this.setState({
                    connect: false,
                    logged: false
                })
            })
        }).catch(e => {
            console.error((e))
            this.setState({
                connect: false,
                logged: false
            })
        })




    }

    handleClick(event) {
        event.preventDefault();

        if (this.state.username) {
            this.setState({
                connect: true
            })
        }
    }

    render() {

        if (this.state.logged !== undefined && !this.state.logged) {
            return (<Redirect to={'/login'}/>)
        }

        if (this.state.connect) {
            return (
                <NewChat username={this.state.username}/>
            )
        }
        return (
            <form className="input_form">

                <div className="input_text">

                    <input name="Username" type="text" placeholder="Username" onChange={e => {
                        this.setState({username: e.target.value})
                    }}/>

                </div>
                <div className="btn">
                    <button onClick={this.handleClick}>CONNECT</button>
                </div>


            </form>)
    }

}