import React, {Component} from "react"
import {Link} from "react-router-dom";
import Message from "./Message";

export default class NewChat extends Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.updateState = this.updateState.bind(this);

        this.state = {
            messages: [],
            message: "",
            user_id: 0,
            countdown: {}
        }
    }

    handleClick(event) {
        event.preventDefault()
        if (this.state.message) {
            fetch('/api/messages', {
                method: "post",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    to: this.props.username,
                    message: this.state.message
                })
            }).then(res => {

                res.json().then(data => {
                    if (data.error) {
                        alert(data.error)
                    }
                }).catch(e => {
                    console.error((e))
                })
            }).catch(e => {
                console.error((e))
            })
        }
        this.setState({
            message: ""
        })
        this.updateState()
    }

    componentDidMount() {
        this.updateState()
        this.state.countdown = setInterval(this.updateState, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.state.countdown);
    }


    updateState() {

        fetch(`/api/users`, {
            method: "get",
            headers: {'Content-Type': 'application/json'}
        }).then(res => {

            res.json().then(data => {
                if (data.error) {
                    console.error(data.error)
                    this.setState({
                        user_id: undefined
                    })
                } else {
                    this.setState({
                        user_id: data.result
                    })
                }
            }).catch(e => {
                console.error((e))
            })
        }).catch(e => {
            console.error((e))
        })

        fetch(`/api/messages?name=${this.props.username}`, {
            method: "get",
            headers: {'Content-Type': 'application/json'}
        }).then(res => {

            res.json().then(data => {
                console.log(data)
                if (data.error) {
                    console.error(data.error)


                    this.setState({
                        messages: undefined
                    })

                } else {
                    console.log(data)
                    this.setState({
                        messages: data
                    })
                }
            }).catch(e => {
                console.error((e))
            })
        }).catch(e => {
            console.error((e))
        })
    }

    render() {
        return (
            <div>

                {
                    this.state.messages ? this.state.messages.map(message => {
                        console.log(message)
                        if (message.from === this.state.user_id) {
                            return (<Message key={message.id} text={message.message} sender={"Me"}/>)
                        } else {
                            return (<Message key={message.id} text={message.message} sender={this.props.username}/>)
                        }
                    }) : <div/>
                }

                <form className="input_form">
                    <div className="input_text">

                        <input name="Message" type="text" placeholder="Message" onChange={e => {
                            this.setState({message: e.target.value})
                        }} value={this.state.message}/>

                    </div>
                    <div className="btn">
                        <button onClick={this.handleClick}>SEND</button>
                    </div>
                </form>
            </div>


        )
    }
}