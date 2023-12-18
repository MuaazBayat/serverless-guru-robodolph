"use client"

import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";

type Field = {
    inputName: string;
    inputLabel: string;
    inputPlaceholder: string;
}

type createDetails = {
    tableName: string;
    redirectUrl: string;
}

type updateDetails = {
    tableName: string;
    redirectUrl: string;
    id: string;
    idColName: string;
}

interface CreateFormProps {
    fields: Field[];
    details: createDetails; // Define the tableName property with a type of string
}

interface UpdateFormProps {
    fields: Field[];
    details: updateDetails; // Define the tableName property with a type of string
}


export function CreateForm({ fields, details}: CreateFormProps) {
    return (
        <Card color="transparent" shadow={false} className="items-center p-20">
            <Typography variant="h4" color="blue-gray">
                Create
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Let's start by filling in the details
            </Typography>
            <form action="/data/insert-data" method="post" className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <input type="hidden" name="tableName" value={details.tableName} />
            <input type="hidden" name="redirectUrl" value={details.redirectUrl} />
                <div className="mb-1 flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <Typography variant="h6" color="blue-gray" className="-mb-3 pb-4">
                                {field.inputLabel}
                            </Typography>
                            <Input
                                size="lg"
                                name={field.inputName}
                                placeholder={field.inputPlaceholder}
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>
                    ))}
                </div>
                <Button type="submit" className="mt-6" fullWidth>
                    submit
                </Button>
            </form>
        </Card>
    );
}

export function UpdateForm({ fields, details}: UpdateFormProps) {
    return (
        <Card color="transparent" shadow={false} className="items-center p-20">
            <Typography variant="h4" color="blue-gray">
                Update
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
                Let's update the details
            </Typography>
            <form action="/data/update-data" method="post" className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <input type="hidden" name="tableName" value={details.tableName} />
            <input type="hidden" name="redirectUrl" value={details.redirectUrl} />
            <input type="hidden" name="id" value={details.id} />
            <input type="hidden" name="idColName" value={details.idColName} />
                <div className="mb-1 flex flex-col gap-6">
                    {fields.map((field, index) => (
                        <div key={index}>
                            <Typography variant="h6" color="blue-gray" className="-mb-3 pb-4">
                                {field.inputLabel}
                            </Typography>
                            <Input
                                size="lg"
                                name={field.inputName}
                                placeholder={field.inputPlaceholder}
                                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>
                    ))}
                </div>
                <Button type="submit" className="mt-6" fullWidth>
                    submit
                </Button>
            </form>
        </Card>
    );
}