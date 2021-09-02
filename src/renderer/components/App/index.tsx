import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

export default class App extends React.Component<
    Record<string, never>,
    AppState
> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            authorized: false,
            isUser: true,
            isAdmin: false,
        };

        this.render = () => {
            const { isUser, isAdmin, authorized } = this.state;
            return (
                <div className="main-container">
                    {authorized && (
                        <div className="pages">
                            <Router>
                                <Switch>
                                    <Route exact path="/">
                                        {isUser ? (
                                            <h2>User</h2>
                                        ) : (
                                            <h2>Admin</h2>
                                        )}
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
        };
    }
}

export interface AppState {
    authorized: boolean;
    isUser: boolean;
    isAdmin: boolean;
}
