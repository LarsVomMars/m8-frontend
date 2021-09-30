/* eslint-disable react/no-unused-state */

import React from "react";
import {
    DataGrid,
    GridEditRowProps,
    GridRowModel,
    GridToolbarContainer,
} from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

import type { AxiosError } from "axios";
import type {
    GridColumns,
    GridEditRowsModel,
    GridRowData,
    GridRowId,
    GridRenderCellParams,
} from "@mui/x-data-grid";

import type { EO, IBasicProduct, IProduct, IProducts } from "../types";
import { APermissions as Permissions, EPermissions } from "../types";

import { getURL, getKey, buildURL, buildHeader } from "../util";

export default class Products extends React.Component<EO, ProductsState> {
    constructor(props: EO) {
        super(props);
        this.state = { products: {}, rows: [], model: {} };
    }

    componentDidMount = async () => {
        const URL = getURL();
        const KEY = getKey();
        try {
            const resp = await axios.get(`${URL}/api/products/`, {
                headers: { Authorization: `Bearer ${KEY}` },
            });

            const products = this.parseProducts(resp.data.products);
            this.updateRows(products);

            console.log(resp.data);
        } catch (e) {
            console.error(e);
            console.error((e as AxiosError).response);
        }
    };

    onChange = (model: GridRowModel) => {
        this.setState({ model });
    };

    onCommit = (id: GridRowId) => {
        const { model: rowModel } = this.state;
        if (Object.prototype.hasOwnProperty.call(rowModel, id)) {
            const product = this.buildBasicProduct(rowModel[id]);
            if (id === "addrow") {
                this.add(product);
            } else {
                this.save({ _id: id as string, ...product });
            }
        }
    };

    add = async (product: IBasicProduct) => {
        const url = buildURL("/api/products/");
        const headers = buildHeader();
        try {
            const resp = await axios.post(url, product, { headers });
            console.log(resp.data);

            const products = this.parseProducts(resp.data.products);
            this.updateRows(products);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    save = async (product: IProduct) => {
        const url = buildURL("/api/products/");
        const headers = buildHeader();
        try {
            const resp = await axios.put(url, product, { headers });
            console.log(resp.data);

            const products = this.parseProducts(resp.data.products);
            this.updateRows(products);
        } catch (e) {
            console.error((e as AxiosError).response);
        }
    };

    del = (id: string) => {
        return async () => {
            const alert = await Swal.fire(
                "Delete?",
                "Do you want to delte the item?",
                "question"
            );
            if (alert.isConfirmed) {
                try {
                    const url = buildURL(`/api/products/${id}`);
                    const headers = buildHeader();
                    const resp = await axios.delete(url, { headers });
                    console.log(resp.data);

                    const products = this.parseProducts(resp.data.products);
                    this.updateRows(products);
                } catch (e) {
                    console.error(e);
                }
            }
        };
    };

    private buildBasicProduct = (model: GridEditRowProps): IBasicProduct => ({
        name: model.name.value as string,
        price: model.price.value as number,
        amount:
            (model.crates.value as number) +
            (model.bottles.value as number) / (model.bottles_per_crate.value as number),
        bottles_per_crate: model.bottles_per_crate.value as number,
        permission: Permissions.indexOf(model.permission.value as string),
    });

    private parseProducts = (prods: IProduct[]) => {
        const products: IProducts = {};
        // eslint-disable-next-line
        for (const { _id, ...prod } of prods) products[_id] = prod;
        this.setState({ products });
        return products;
    };

    private updateRows = (products: IProducts) => {
        console.log("Updating rows!", products);
        const rows: GridRowData[] = [];
        for (const [id, product] of Object.entries(products)) {
            rows.push({
                ...product,
                id,
                crates: Math.floor(product.amount),
                bottles: (product.amount % 1) * product.bottles_per_crate,
                permission: Permissions[product.permission],
                delete: id,
            });
        }
        console.log(rows);
        this.setState({ rows });
    };

    private handleToolbar = async () => {
        const row = {
            id: "addrow",
            name: "Name",
            price: 0,
            crates: 0,
            bottles: 0,
            bottles_per_crate: 0,
            permission: Permissions[EPermissions.TN],
        };
        const { rows } = this.state;
        const nrows = [...rows, row];
        this.setState({ rows: nrows });
    };

    private toolbar = () => {
        return (
            <GridToolbarContainer>
                <Button
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={this.handleToolbar}
                >
                    Add product
                </Button>
            </GridToolbarContainer>
        );
    };

    private renderDelete = (params: GridRenderCellParams) => (
        <DeleteIcon onClick={this.del(params.value as string)} />
    );

    private renderPrice = (params: GridRenderCellParams) => `${params.value}€`;

    render() {
        const columns: GridColumns = [
            { field: "name", headerName: "Name", editable: true, width: 100 },
            {
                field: "price",
                headerName: "Price",
                editable: true,
                type: "number",
                width: 100,
                renderCell: this.renderPrice,
            },
            {
                field: "crates",
                headerName: "Crates",
                editable: true,
                type: "number",
                width: 100,
            },
            {
                field: "bottles",
                headerName: "Bottles",
                editable: true,
                type: "number",
                width: 100,
            },
            {
                field: "bottles_per_crate",
                headerName: "Bottles per crate",
                editable: true,
                type: "number",
                width: 100,
            },
            {
                field: "permission",
                headerName: "Permission",
                editable: true,
                width: 150,
                type: "singleSelect",
                valueOptions: Permissions,
            },
            {
                field: "delete",
                headerName: "Delete",
                editable: false,
                width: 50,
                renderCell: this.renderDelete,
            },
        ];

        const { rows, model } = this.state;

        return (
            <div className="page-div">
                <div style={{ height: 500, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        editMode="row"
                        editRowsModel={model}
                        onEditRowsModelChange={this.onChange}
                        onRowEditCommit={this.onCommit}
                        components={{
                            Toolbar: this.toolbar,
                        }}
                    />
                </div>
            </div>
        );
    }
}

export interface ProductsState {
    products: IProducts;
    rows: GridRowData[];
    model: GridEditRowsModel;
}
