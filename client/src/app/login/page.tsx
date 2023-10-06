"use client";

import { LoginForm, LoginFormInputs } from "@/components/forms/login-form";
import { signIn } from "@/lib/client";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const onSubmit: SubmitHandler<LoginFormInputs> = ({ email, password }) => {
    signIn({ email, password })
      .then(() => {
        router.push('/');
      });
  }
  return (
    <main className="h-full">
      <div className="h-screen flex justify-center items-center">
        <div className="w-[500px] px-6">
          <LoginForm onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  );
}