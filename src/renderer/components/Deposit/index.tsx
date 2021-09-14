import React from "react";
import axios from "axios";
import { Button, InputAdornment, TextField } from "@material-ui/core";
import type { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import type { EO } from "../App";

import "./Deposit.scss";

export default class Deposit extends React.Component<EO, DepositState> {
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

    async onSubmit(event: FormEvent) {
        // TODO: Swal
        event.preventDefault();
        try {
            const resp = await axios.put(
                `${process.env.REACT_APP_SERVER_URL}/api/transaction/deposit`,
                this.state,
                { headers: { Authorization: `Bearer ${process.env.REACT_APP_AUTH_KEY}` } }
            );
            console.log(resp);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // eslint-disable-next-line
        this.setState({ [name]: value } as Pick<DepositState, any>);
    };

    render() {
        const { balance, adminQR, adminPin, userQR, userPin } = this.state;
        return (
            <div className="page-div">
                <h1 className="heading">Deposit</h1>
                <form className="deposit-form basic-form" onSubmit={this.onSubmit}>
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
                            },
                        }}
                        name="balance"
                        label="Balance"
                        size="small"
                        className="deposit-form-input"
                        required
                    />
                    <TextField
                        value={adminQR}
                        onChange={this.onChange}
                        name="adminQR"
                        variant="outlined"
                        label="Admin QR"
                        size="small"
                        className="deposit-form-input"
                        required
                    />
                    <TextField
                        value={adminPin}
                        onChange={this.onChange}
                        name="adminPin"
                        variant="outlined"
                        label="Admin Pin"
                        size="small"
                        className="deposit-form-input"
                        type="password"
                        required
                    />
                    <TextField
                        value={userQR}
                        onChange={this.onChange}
                        name="userQR"
                        variant="outlined"
                        label="User QR"
                        size="small"
                        className="deposit-form-input"
                        required
                    />
                    <TextField
                        value={userPin}
                        onChange={this.onChange}
                        name="userPin"
                        variant="outlined"
                        label="User Pin"
                        size="small"
                        className="deposit-form-input"
                        type="password"
                        required
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        className="deposit-form-input"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export interface DepositState {
    balance: number;
    adminQR: string;
    adminPin: string;
    userQR: string;
    userPin: string;
}
