import React from "react";
import { Button, InputAdornment, TextField } from "@material-ui/core";
import axios from "axios";

import type { ChangeEvent, FormEvent } from "react";
import type { AxiosError } from "axios";
import type { EO } from "../types";

import { getURL, getKey } from "../util";

import "./User.scss";

export default class User extends React.Component<EO, UserState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            balance: 0,
            adminQR: "",
            adminPin: "",
            userQR: "",
            userPin: "",
        };
    }

    onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.post(`${URL}/api/user`, this.state, {
                headers: { Authorization: `Bearer ${KEY}` },
            });
            console.log(resp);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // eslint-disable-next-line
        this.setState({ [name]: value } as Pick<UserState, any>);
    };

    render() {
        const { balance, adminQR, adminPin, userQR, userPin } = this.state;
        return (
            <div className="page-div">
                <h1 className="heading">User</h1>
                <form className="user-form basic-form" onSubmit={this.onSubmit}>
                    <TextField
                        value={balance}
                        onChange={this.onChange}
                        type="number"
                        variant="outlined"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">€</InputAdornment>
                            ),
                            inputProps: {
                                step: 0.1,
                                min: 0,
                                max: 100,
                            },
                        }}
                        name="balance"
                        label="Balance"
                        size="small"
                        className="user-form-input"
                        required
                    />
                    <TextField
                        value={adminQR}
                        onChange={this.onChange}
                        name="adminQR"
                        variant="outlined"
                        label="Admin QR"
                        size="small"
                        className="user-form-input"
                        required
                    />
                    <TextField
                        value={adminPin}
                        onChange={this.onChange}
                        name="adminPin"
                        variant="outlined"
                        label="Admin Pin"
                        size="small"
                        className="user-form-input"
                        type="password"
                        required
                        InputProps={{
                            inputProps: {
                                minLength: 4,
                                maxLength: 4,
                            },
                        }}
                    />
                    <TextField
                        value={userQR}
                        onChange={this.onChange}
                        name="userQR"
                        variant="outlined"
                        label="User QR"
                        size="small"
                        className="user-form-input"
                        required
                    />
                    <TextField
                        value={userPin}
                        onChange={this.onChange}
                        name="userPin"
                        variant="outlined"
                        label="User Pin"
                        size="small"
                        className="user-form-input"
                        type="password"
                        required
                        InputProps={{
                            inputProps: {
                                minLength: 4,
                                maxLength: 4,
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className="user-form-input"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export interface UserState {
    balance: number;
    adminQR: string;
    adminPin: string;
    userQR: string;
    userPin: string;
}
