import React from "react";
import axios from "axios";
import {
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";

import type { ChangeEvent, FormEvent } from "react";
import type { SelectChangeEvent } from "@mui/material";
import type { Method, AxiosResponse } from "axios";

import { buildURL, buildHeader } from "../util";

export default class Form extends React.Component<FormProps, FormState> {
    private static buildSubmitButton(element: FormElement) {
        const { label } = element;
        return (
            <Button variant="contained" color="primary" type="submit" key="submit">
                {label}
            </Button>
        );
    }

    constructor(props: FormProps) {
        super(props);

        const state: Record<string, string | number> = {};
        for (const element of props.elements) {
            if (element.type === "select") {
                const option = element.selectOptions?.find((o) => o.selected);
                state[element.name] = option?.value || "";
            } else {
                state[element.name] = element.type === "number" ? 0 : "";
            }
        }

        this.state = { ...props, state };
    }

    private onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const { onSuccess, onError, state: data, method, url: path } = this.state;
        try {
            const url = buildURL(path);
            const headers = buildHeader();
            const response = await axios.request({ method, url, headers, data });
            if (onSuccess) onSuccess(response);
        } catch (e) {
            if (onError) onError(e);
        }
    };

    private onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const { state } = this.state;
        state[name] = value;
        this.setState({ state });
    };

    private onSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        const { state } = this.state;
        state[name] = value;
        this.setState({ state });
    };

    private buildInput(element: FormElement) {
        const { state } = this.state;
        const { name, type, label, required } = element;
        return (
            <TextField
                variant="outlined"
                size="small"
                value={state[name]}
                name={name}
                label={label}
                type={type}
                required={required}
                key={name}
                onChange={this.onChange}
            />
        );
    }

    private buildSelect(element: FormElement) {
        const { state } = this.state;
        const { name, label, required, selectOptions } = element;
        return (
            <FormControl variant="outlined" size="small" key={name}>
                <InputLabel htmlFor={`${name}-select`}>{label}</InputLabel>
                <Select
                    id={`${name}-select`}
                    value={state[name] as string}
                    name={name}
                    label={label}
                    required={required}
                    onChange={this.onSelectChange}
                >
                    {selectOptions?.map(({ value, displayName, selected, disabled }) => (
                        <MenuItem
                            value={value}
                            key={value}
                            selected={selected}
                            disabled={disabled}
                        >
                            {displayName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }

    render() {
        const { elements } = this.state;

        return (
            <form onSubmit={this.onSubmit} className="basic-form">
                {elements?.map((element) => {
                    if (element.type === "select") return this.buildSelect(element);
                    if (element.type === "submit") return Form.buildSubmitButton(element);
                    return this.buildInput(element);
                })}
            </form>
        );
    }
}

export interface FormProps {
    elements: FormElements;
    onSuccess?: (response: AxiosResponse) => void;
    onError?: (error: unknown) => void;
    method: Method;
    url: string;
}

export interface FormState extends FormProps {
    state: Record<string, string | number>;
}

export interface FormElement {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    selectOptions?: FormOptionElement[];
}

export type FormElements = FormElement[];

export interface FormOptionElement {
    value: string;
    displayName: string;
    selected?: boolean;
    disabled?: boolean;
}
