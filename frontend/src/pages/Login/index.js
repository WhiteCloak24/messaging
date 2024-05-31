import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api-service";
const Login = () => {

  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      username: "",
    },
  });
  const { mutate, isPending } = useMutation({ mutationKey: "login", mutationFn: login });

  function onSubmit(values) {
    mutate(values);
  }

  return (
    <div className="h-full flex items-center justify-center">
      <dev className="h-1/2 w-2/5 rounded-md flex flex-col items-center p-4 bg-gray-400">
        <div className="text-black font-bold text-4xl mt-5">Login</div>
        <div className="mt-8 w-full">
          <div className="font-medium text-xl text-black mb-2">Enter Username</div>
          <Controller
            name={"username"}
            control={control}
            render={({ field }) => {
              return <input {...field} className="h-12" type="text" />;
            }}
          />
        </div>
        <div className="mt-8 w-full">
          <div className="font-medium text-xl text-black mb-2">Enter Email</div>
          <Controller
            name={"email"}
            control={control}
            render={({ field }) => {
              return <input {...field} className="h-12" type="email" />;
            }}
          />
        </div>

        <div className="login-btn-group mt-10">
          <button onClick={handleSubmit(onSubmit)} type="button" disabled={isPending} className="bg-gray-600 text-white rounded-md h-12 w-full">
            {isPending ? "Please wait" : "Submit"}
          </button>
        </div>
      </dev>
    </div>
  );
};

export default Login;
