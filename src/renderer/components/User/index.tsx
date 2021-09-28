import React from "react";
import { InputAdornment } from "@mui/material";
import Swal from "sweetalert2";

import type { AxiosError, AxiosResponse } from "axios";
import type { FormElements } from "../Form";

import { EPermissions, APermissions } from "../types";
import Form from "../Form";

export function onSuccess(_response: AxiosResponse) {
    Swal.fire("User added");
}

export function onError(error: unknown) {
    if ((error as AxiosError).response) {
        Swal.fire("Error", JSON.stringify((error as AxiosError).response?.data), "error");
    } else console.error(error);
}

export default function User() {
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
        {
            name: "permission",
            label: "Permission",
            type: "select",
            required: true,
            selectOptions: Object.keys(EPermissions)
                .filter((p) => !Number.isNaN(+p))
                .map(Number)
                .map((p: number) => ({
                    displayName: APermissions[p],
                    value: p,
                })),
        },
        { name: "", label: "Add user", type: "submit" },
    ];
    return (
        <div className="page-div">
            <h1 className="heading">User</h1>
            <Form
                elements={elements}
                method="post"
                url="/api/user/"
                onSuccess={onSuccess}
                onError={onError}
            />
        </div>
    );
}
