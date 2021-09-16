import React from "react";
import { TextField, Button } from "@material-ui/core";
import axios from "axios";

import type { ChangeEvent, FormEvent } from "react";
import type { AxiosError } from "axios";
import type { EO } from "../types";

import "./Clear.scss";

export default class Clear extends React.Component<EO, ClearState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            adminQR: "",
            adminPin: "",
            userQR: "",
            userPin: "",
        };
    }

    onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        // eslint-disable-next-line
        this.setState({ [name]: value } as Pick<ClearState, any>);
    };

    onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            // TODO: Request balance; Fire Swal
            console.log("Wohoo");
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    render() {
        const { adminQR, adminPin, userQR, userPin } = this.state;
        return (
            <div className="page-div">
                <h1 className="heading">Clear</h1>
                <form className="clear-form basic-form" onSubmit={this.onSubmit}>
                    <TextField
                        value={adminQR}
                        onChange={this.onChange}
                        name="adminQR"
                        variant="outlined"
                        label="Admin QR"
                        size="small"
                        className="clear-form-input"
                        required
                    />
                    <TextField
                        value={adminPin}
                        onChange={this.onChange}
                        name="adminPin"
                        variant="outlined"
                        label="Admin Pin"
                        size="small"
                        className="clear-form-input"
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
                        className="clear-form-input"
                        required
                    />
                    <TextField
                        value={userPin}
                        onChange={this.onChange}
                        name="userPin"
                        variant="outlined"
                        label="User Pin"
                        size="small"
                        className="clear-form-input"
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
                        className="clear-form-input"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export interface ClearState {
    adminQR: string;
    adminPin: string;
    userQR: string;
    userPin: string;
}
