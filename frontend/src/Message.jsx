import React, {Component} from "react"

export default class Message extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div className="message">
                <h5>{this.props.sender}</h5>
                <p>{this.props.text}</p>
            </div>
        )
    }
}