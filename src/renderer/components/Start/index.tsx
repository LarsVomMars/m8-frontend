import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

export default class Start extends React.Component<StartProps, StartState> {
    constructor(props: StartProps) {
        super(props);
        this.state = { ...props };
    }

    private static renderAdmin() {
        return (
            <div className="page-div">
                <h1 className="heading">Admin</h1>
                <div className="buttons">
                    <Link to="/deposit">
                        <Button variant="contained" color="primary" className="button">
                            Deposit
                        </Button>
                    </Link>
                    <Link to="/buy">
                        <Button variant="contained" color="primary" className="button">
                            Buy
                        </Button>
                    </Link>
                    <Link to="/user">
                        <Button variant="contained" color="secondary" className="button">
                            User
                        </Button>
                    </Link>
                    <Link to="/clear">
                        <Button variant="contained" color="secondary" className="button">
                            Clear
                        </Button>
                    </Link>
                    <Link to="/products">
                        <Button variant="contained" color="secondary" className="button">
                            Products
                        </Button>
                    </Link>
                    <Link to="/admin">
                        <Button variant="contained" color="primary" className="button">
                            Admin
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    private static renderUser() {
        // TODO: Consider stuff yk
        return <h2>User</h2>;
    }

    render() {
        const { admin } = this.state;
        return admin ? Start.renderAdmin() : Start.renderUser();
    }
}

export interface StartProps {
    admin: boolean;
}

export type StartState = StartProps;
