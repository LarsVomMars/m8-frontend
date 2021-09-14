import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import type { AxiosError } from "axios";

import Start from "../Start";
import Header from "../Header";

import "./App.global.scss";

export enum ApiPermissions {
    READ,
    WRITE,
    ADMIN,
}

export default class App extends React.Component<Record<string, never>, AppState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            authorized: true,
            isUser: true,
            isAdmin: true,
        };
    }

    /* async componentDidMount() {
        try {
            const resp = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_AUTH_KEY}`,
                },
            });
            console.log(resp.data);
            const { permission } = resp.data;
            this.setState({
                isAdmin: permission === ApiPermissions.ADMIN,
                isUser: permission === ApiPermissions.READ,
                authorized: true,
            });
        } catch (e) {
            console.error((e as AxiosError).response);
            console.log("Ignore this error");
        }
    } */

    render() {
        const { isUser, isAdmin, authorized } = this.state;
        return (
            <div className="main-container">
                <Header />
                {authorized && isUser && (
                    <div className="pages">
                        <Router>
                            <Switch>
                                <Route exact path="/">
                                    <Start admin={isAdmin} />
                                </Route>
                                {isAdmin && (
                                    <div>
                                        <Route path="/deposit">
                                            <h1>Deposit</h1>
                                        </Route>
                                        <Route path="/buy">
                                            <h1>Buy</h1>
                                        </Route>
                                        <Route path="/user">
                                            <h1>User</h1>
                                        </Route>
                                        <Route path="/clear">
                                            <h1>Clear</h1>
                                        </Route>
                                        <Route path="/products">
                                            <h1>Products</h1>
                                        </Route>
                                        <Route path="/admin">
                                            <h1>Admin</h1>
                                        </Route>
                                    </div>
                                )}
                                <Route path="*">
                                    <Redirect to="/" />
                                </Route>
                            </Switch>
                        </Router>
                    </div>
                )}
            </div>
        );
    }
}

export interface AppState {
    authorized: boolean;
    isUser: boolean;
    isAdmin: boolean;
}
