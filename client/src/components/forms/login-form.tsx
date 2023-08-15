"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/app/types";
import { FC } from "react";

export type LoginFormInputs = Pick<User, "username">;

export const LoginForm: FC<{ onSubmit: SubmitHandler<LoginFormInputs> }> = ({ onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Start the chat</CardTitle>
                    <CardDescription>
                        Enter your username to begin conversation
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" type="string" placeholder="john.doe" {...register('username', { required: 'You must provide the username' })} />
                        {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Connect</Button>
                </CardFooter>
            </Card>
        </form>
    )
}