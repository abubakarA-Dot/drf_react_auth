import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import apiClient from "../apiClient";
import { useQuery } from "@tanstack/react-query";
import Page from "../Page";
import { FormInput } from "../FormInput";

export const EditUser = () => {
    const methods = useForm();
    const { register, handleSubmit, setValue, reset, getValues } = methods;
    const userId = window.location.pathname.split("/").pop();
    const { data:user, refetch } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
    });
    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

  const onSubmit = async (data) => {
    try {
        await apiClient.put(`/users/${userId}/`, data);
        alert("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user");
    }
  };

  return (
    <Page title="Edit User">
        <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>

            <FormGroup>
                <Label for="name">Name</Label>
                <FormInput
                    id="name"
                    name="name"
                    type="text"
                />
            </FormGroup>
            <FormGroup>
                <Label for="company">Company</Label>
                <FormInput
                    id="company"
                    name="company"
                    type="text"
                />
            </FormGroup>

            <FormGroup>
                <Label for="email">Email</Label>
                <FormInput
                    id="email"
                    name="email"
                    type="email"
                />
            </FormGroup>

            <Button color="primary">Submit</Button>

        </Form>
        </FormProvider>
    </Page>
  );
}