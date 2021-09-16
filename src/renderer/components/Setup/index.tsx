import React from "react";
import { TextField, Button, InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import type { ChangeEvent, FormEvent } from "react";
import type { EO } from "../types";

import { getURL, getKey } from "../util";

export default class Setup extends React.Component<EO, SetupState> {
    constructor(props: EO) {
        super(props);
        this.state = {
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
        console.log(this.state);
        window.location.reload();
    };

    onClickShowKey = () => {
        const { showKey } = this.state;
        this.setState({ showKey: !showKey });
    };

    render() {
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
                                        // onMouseDown={handleMouseDownPassword}
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
}

export interface SetupState {
    serverURL: string;
    authKey: string;
    showKey: boolean;
}
