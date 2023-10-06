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
import { FC } from "react";

export type LoginFormInputs = { email: string, password: string };

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
                        Login to start a session
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" {...register('email', { required: 'You must provide the email' })} />
                        {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Password</Label>
                        <Input id="password" type="password" {...register('password', { required: 'You must provide the password' })} />
                        {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Connect</Button>
                </CardFooter>
            </Card>
        </form>
    )
}