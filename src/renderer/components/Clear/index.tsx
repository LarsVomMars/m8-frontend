import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

import type { AxiosError } from "axios";
import type { FormElements } from "../Form";

import { buildURL, buildHeader } from "../util";
import Form from "../Form";

export async function onSubmit(data: Record<string, string | number>) {
    console.log(data);

    try {
        const headers = buildHeader();
        const resp = await axios.get(buildURL(`/api/user/${data.userQR}`), { headers });
        const { balance } = resp.data;

        const result = await Swal.fire(
            `Clear account of ${data.userQR}?`,
            `Pay out balance: ${balance}`,
            "question"
        );

        if (result.isConfirmed) {
            try {
                const clearResp = await axios.put(
                    buildURL(`/api/transaction/clear`),
                    data,
                    { headers }
                );
                console.log(clearResp);
                Swal.fire("Account cleared!");
            } catch (e) {
                console.error("2:", e);
                Swal.fire(
                    "Could not clear account!",
                    JSON.stringify((e as AxiosError).response?.data),
                    "error"
                );
            }
        }
    } catch (e) {
        console.error("1:", e);
        Swal.fire(
            "Could not clear account!",
            JSON.stringify((e as AxiosError).response?.data),
            "error"
        );
    }
}

export default function Clear() {
    const elements: FormElements = [
        { name: "adminQR", label: "Admin QR", type: "text", required: true },
        { name: "adminPin", label: "Admin Pin", type: "password", required: true },
        { name: "userQR", label: "User QR", type: "text", required: true },
        { name: "userPin", label: "User Pin", type: "password", required: true },
        { name: "", label: "Clear", type: "submit" },
    ];

    return (
        <div className="page-div">
            <h1 className="heading">Clear</h1>
            <Form elements={elements} method="get" url="" onSubmit={onSubmit} />
        </div>
    );
}
