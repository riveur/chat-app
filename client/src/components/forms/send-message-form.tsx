"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { FC, HTMLAttributes, forwardRef } from "react";
import { MessageSchema as Message } from "@/lib/validation";

export type SendMessageFormInputs = Pick<Message, "content">;

export const SendMessageForm = forwardRef<HTMLFormElement, Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> & { onSubmit: SubmitHandler<SendMessageFormInputs> }>(({ onSubmit }, ref) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SendMessageFormInputs>();
    return (
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 flex items-center justify-between">
                <Input
                    {...register('content', { required: true })}
                    id="content"
                    name="content"
                    className="h-14 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Your message"
                    autoComplete="off"
                />
                <Button size="icon" className="rounded-full"><SendHorizonal size={16} /></Button>
            </div>
        </form>
    )
});

SendMessageForm.displayName = "SendMessageForm";