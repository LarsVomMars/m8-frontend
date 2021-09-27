import React from "react";
import axios from "axios";
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";

import type { AxiosError } from "axios";
import type { ChangeEvent, FormEvent } from "react";
import type { EO, IProduct } from "../types";

import { getURL, getKey, getStateFromURL } from "../util";

import "./Buy.scss";

export default class Buy extends React.Component<EO, BuyState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            pid: "",
            adminQR: "",
            adminPin: "",
            userQR: "",
            userPin: "",
            products: [],
        };
    }

    componentDidMount = async () => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.get(`${URL}/api/products/`, {
                headers: {
                    Authorization: `Bearer ${KEY}`,
                },
            });
            this.setState({ products: resp.data.products as IProduct[] });
            console.log(resp.data);
        } catch (e) {
            console.error((e as AxiosError).response);
        }

        // Get parameters from GET if they exist
        const newState = getStateFromURL<BuyState>(this.state);
        this.setState({ ...newState });
    };

    onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.post(`${URL}/api/transaction/buy`, this.state, {
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
        this.setState({ [name]: value } as Pick<BuyState, any>);
    };

    onSelectChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = event.target as HTMLSelectElement;
        // eslint-disable-next-line
        this.setState({ [name!]: value as string } as Pick<BuyState, any>);
    };

    render() {
        const { pid, userQR, userPin, adminQR, adminPin, products } = this.state;
        return (
            <div className="page-div">
                <h1 className="heading">Buy</h1>
                <form className="buy-form basic-form">
                    <FormControl
                        variant="outlined"
                        className="buy-form-select"
                        size="small"
                    >
                        <InputLabel htmlFor="buy-select">Product</InputLabel>
                        <Select
                            id="buy-select"
                            value={pid}
                            onChange={this.onSelectChange}
                            label="Product"
                            name="pid"
                            required
                        >
                            <MenuItem value="" key="-1" disabled>
                                <em>None</em>
                            </MenuItem>
                            {products.map((product) => (
                                <MenuItem
                                    value={product._id}
                                    disabled={product.amount === 0}
                                    key={product._id}
                                >
                                    {product.name} - {product.price}€
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        value={adminQR}
                        onChange={this.onChange}
                        name="adminQR"
                        variant="outlined"
                        label="Admin QR"
                        size="small"
                        className="buy-form-input"
                        required
                    />
                    <TextField
                        value={adminPin}
                        onChange={this.onChange}
                        name="adminPin"
                        variant="outlined"
                        label="Admin Pin"
                        size="small"
                        className="buy-form-input"
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
                        className="buy-form-input"
                        required
                    />
                    <TextField
                        value={userPin}
                        onChange={this.onChange}
                        name="userPin"
                        variant="outlined"
                        label="User Pin"
                        size="small"
                        className="buy-form-input"
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
                        className="buy-form-input"
                        type="submit"
                    >
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

export interface BuyState {
    pid: string;
    adminQR: string;
    adminPin: string;
    userQR: string;
    userPin: string;
    products: IProduct[];
}
