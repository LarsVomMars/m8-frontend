import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

import type { AxiosError, AxiosResponse } from "axios";
import type { EO, IProduct } from "../types";
import type { FormElements } from "../Form";

import { buildURL, buildHeader } from "../util";
import Form from "../Form";

export default class Buy extends React.Component<EO, BuyState> {
    constructor(props: EO) {
        super(props);
        this.state = {
            products: [],
        };
    }

    componentDidMount = async () => {
        const url = buildURL("/api/products/");
        const headers = buildHeader();
        try {
            const resp = await axios.get(url, { headers });
            this.setState({ products: resp.data.products as IProduct[] });
            console.log(resp.data);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    private static onSuccess(response: AxiosResponse) {
        Swal.fire("Transaction successful", `Remaining balance ${response.data.balance}`);
    }

    private static onError(error: unknown) {
        if ((error as AxiosError).response) {
            Swal.fire(
                "Error",
                JSON.stringify((error as AxiosError).response?.data),
                "error"
            );
        }
    }

    render() {
        const { products } = this.state;
        const elements: FormElements = [
            {
                name: "pid",
                label: "Product",
                type: "select",
                required: true,
                selectOptions: [
                    { displayName: "None", value: "-1", selected: true, disabled: true },
                    ...products.map((p) => ({
                        displayName: `${p.name} - ${p.price}€`,
                        value: p._id,
                        disabled: p.amount === 0,
                    })),
                ],
            },
            { name: "adminQR", label: "Admin QR", type: "text", required: true },
            { name: "adminPin", label: "Admin Pin", type: "password", required: true },
            { name: "userQR", label: "User QR", type: "text", required: true },
            { name: "userPin", label: "User Pin", type: "password", required: true },
            { name: "", label: "Buy", type: "submit" },
        ];

        return (
            <div className="page-div">
                <h1 className="heading">Buy</h1>
                <Form
                    elements={elements}
                    method="post"
                    url="/api/transaction/buy"
                    key={products.length.toString()}
                    onSuccess={Buy.onSuccess}
                    onError={Buy.onError}
                />
            </div>
        );
    }
}

export interface BuyState {
    products: IProduct[];
}
