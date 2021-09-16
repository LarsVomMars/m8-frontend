import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";

import type { AxiosError } from "axios";
import { EO } from "../types";

import Header from "../Header";
import Start from "../Start";
import Deposit from "../Deposit";
import Buy from "../Buy";
import User from "../User";
import Clear from "../Clear";

import "./App.global.scss";
import Products from "../Products";

export default class App extends React.Component<EO, AppState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            authorized: true,
            isUser: true,
            isAdmin: true,
        };
    }

    componentDidMount = async () => {
        try {
            const resp = await axios.get(`${process.env.REACT_APP_SERVER_URL}/auth/`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_AUTH_KEY}`,
                },
            });
            console.log(resp.data);
            // const { permission } = resp.data;
            // this.setState({
            //     isAdmin: permission === ApiPermissions.ADMIN,
            //     isUser: permission === ApiPermissions.READ,
            //     authorized: true,
            // });
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

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
                                            <Deposit />
                                        </Route>
                                        <Route path="/buy">
                                            <Buy />
                                        </Route>
                                        <Route path="/user">
                                            <User />
                                        </Route>
                                        <Route path="/clear">
                                            <Clear />
                                        </Route>
                                        <Route path="/products">
                                            <Products />
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
