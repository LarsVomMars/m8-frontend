import React from "react";
import Swal from "sweetalert2";

import { InputAdornment } from "@mui/material";

import type { AxiosError, AxiosResponse } from "axios";
import type { FormElements } from "../Form";

import Form from "../Form";

export function onSuccess(response: AxiosResponse) {
    Swal.fire("Money deposited", `Balance ${response.data.balance}`);
}

export function onError(error: unknown) {
    if ((error as AxiosError).response) {
        Swal.fire("Error", JSON.stringify((error as AxiosError).response?.data), "error");
    } else console.error(error);
}

export default function Deposit() {
    const elements: FormElements = [
        {
            name: "balance",
            label: "Balance",
            type: "number",
            required: true,
            inputProps: {
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
            },
        },
        { name: "adminQR", label: "Admin QR", type: "text", required: true },
        { name: "adminPin", label: "Admin Pin", type: "password", required: true },
        { name: "userQR", label: "User QR", type: "text", required: true },
        { name: "userPin", label: "User Pin", type: "password", required: true },
        { name: "", label: "Deposit", type: "submit" },
    ];

    return (
        <div className="page-div">
            <h1 className="heading">User</h1>
            <Form
                elements={elements}
                method="put"
                url="/api/transaction/deposit"
                onSuccess={onSuccess}
                onError={onError}
            />
        </div>
    );
}
