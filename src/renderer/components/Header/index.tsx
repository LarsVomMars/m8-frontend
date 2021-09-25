import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { TextField, Button } from "@material-ui/core";

import type { FormEvent } from "react";
import type { AxiosError } from "axios";
import type { EO } from "../types";

import { getKey, getURL } from "../util";
import "./Header.scss";

export default class Header extends React.Component<EO, HeaderState> {
    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            qr: "",
        };
    }

    checkQR = async (event: FormEvent) => {
        event.preventDefault();
        const URL = getURL();
        const KEY = getKey();
        const { qr } = this.state;
        try {
            const response = await axios.get(`${URL}/api/user/${qr}`, {
                headers: { Authorization: `Bearer ${KEY}` },
            });
            console.log(response);
            console.log(response.data);
            Swal.fire({
                title: `Balance of ${qr}`,
                text: `${response.data.balance}€`,
                icon: "success",
                showCloseButton: true,
            });
        } catch (e) {
            console.error((e as AxiosError).response);
            Swal.fire({
                title: "Request failed!",
                text: `${qr} not found!`,
                icon: "error",
            });
        }
    };

    onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ qr: event.target.value });

    onHome = () => window.location.assign("/");

    render() {
        const { qr } = this.state;
        return (
            <div className="header">
                <h3 onClick={this.onHome} role="presentation">
                    M8
                </h3>
                <div className="header-form-div">
                    <form onSubmit={this.checkQR}>
                        <TextField
                            size="small"
                            label="QR Code"
                            variant="outlined"
                            value={qr}
                            onChange={this.onChange}
                            color="secondary"
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Check
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

export interface HeaderState {
    qr: string;
}
