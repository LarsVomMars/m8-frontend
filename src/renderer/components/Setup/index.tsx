import React from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import type { ChangeEvent, FormEvent } from "react";

import { getURL, getKey } from "../util";

import "./Setup.scss";

export default class Setup extends React.Component<SetupProps, SetupState> {
    constructor(props: SetupProps) {
        super(props);
        this.state = {
            ...props,
            serverURL: getURL(),
            authKey: getKey(),
            showKey: false,
        };
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // eslint-disable-next-line
        this.setState({ [name]: value } as Pick<SetupState, any>);
    };

    onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const { serverURL, authKey } = this.state;
        localStorage.setItem("SERVER_URL", serverURL);
        localStorage.setItem("AUTH_KEY", authKey);
        window.location.reload();
    };

    onClickShowKey = () => {
        const { showKey } = this.state;
        this.setState({ showKey: !showKey });
    };

    private renderSetup() {
        const { serverURL, authKey, showKey } = this.state;
        return (
            <div className="page-div">
                <h1 className="heading">Clear</h1>
                <form className="setup-form basic-form" onSubmit={this.onSubmit}>
                    <TextField
                        value={serverURL}
                        onChange={this.onChange}
                        name="serverURL"
                        variant="outlined"
                        label="Server URL"
                        size="small"
                        className="setup-form-input"
                        required
                    />
                    <TextField
                        value={authKey}
                        onChange={this.onChange}
                        name="authKey"
                        variant="outlined"
                        label="Auth key"
                        size="small"
                        className="setup-form-input"
                        type={showKey ? "text" : "password"}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle key visibility"
                                        onClick={this.onClickShowKey}
                                    >
                                        {showKey ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className="setup-form-input"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        );
    }

    private static renderUnavailable() {
        // const tid = setTimeout(() => {
        //     window.location.reload();
        //     clearTimeout(tid);
        // }, 15000);
        const onClick = () => {
            localStorage.removeItem("SERVER_URL");
            localStorage.removeItem("AUTH_KEY");
            window.location.reload();
        };

        const onReload = () => {
            window.location.reload();
        };

        return (
            <div className="page-div">
                <h1 className="heading">Server unavailable</h1>
                <h3 className="heading">Please wait!</h3>
                <div className="setup-buttons">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={onReload}
                    >
                        Reload?
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        onClick={onClick}
                    >
                        Delete data!
                    </Button>
                </div>
            </div>
        );
    }

    render() {
        const { allow } = this.state;
        return allow ? this.renderSetup() : Setup.renderUnavailable();
    }
}

export interface SetupProps {
    allow: boolean;
}

export interface SetupState extends SetupProps {
    serverURL: string;
    authKey: string;
    showKey: boolean;
}
