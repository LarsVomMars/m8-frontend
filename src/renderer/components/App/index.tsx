import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";

import type { AxiosError } from "axios";
import { EO, ApiPermissions } from "../types";

import Header from "../Header";
import Start from "../Start";
import Deposit from "../Deposit";
import Buy from "../Buy";
import User from "../User";
import Clear from "../Clear";
import Setup from "../Setup";
import Products from "../Products";

import { getURL, getKey } from "../util";

import "./App.global.scss";

export default class App extends React.Component<EO, AppState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            available: true,
            serverAvailable: false,
            authorized: false,
            isUser: false,
            isAdmin: false,
        };
    }

    componentDidMount = async () => {
        const URL = getURL();
        const KEY = getKey();
        if (!URL || !KEY) {
            this.setState({ available: false, serverAvailable: true });
            return;
        }
        this.setState({ available: true });
        try {
            const resp = await axios.get(`${URL}/auth/`, {
                headers: {
                    Authorization: `Bearer ${KEY}`,
                },
            });
            console.log(resp.data);
            const { permission } = resp.data;
            // Possible securiy risk in case of unavailable backend
            this.setState({
                isAdmin: permission === ApiPermissions.ADMIN,
                isUser:
                    permission === ApiPermissions.READ ||
                    permission === ApiPermissions.ADMIN,
                authorized: true,
                serverAvailable: true,
            });
        } catch (e) {
            if (!(e as AxiosError).response?.status) {
                this.setState({ serverAvailable: false });
            } else {
                this.setState({ authorized: false, serverAvailable: true });
                console.error((e as AxiosError).response);
            }
        }
    };

    render() {
        const { isUser, isAdmin, authorized, available, serverAvailable } = this.state;
        console.log(this.state);
        return (
            <div className="main-container">
                <Header />
                <div className="pages">
                    {(!available || !authorized) && (
                        // That's why i hate React. Why tf do you need a key
                        <Setup allow={serverAvailable} key={serverAvailable.toString()} />
                    )}

                    {available && authorized && isUser && (
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
                    )}
                </div>
            </div>
        );
    }
}

export interface AppState {
    available: boolean;
    serverAvailable: boolean;
    authorized: boolean;
    isUser: boolean;
    isAdmin: boolean;
}
