import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api-service";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { dispatchCustomEventFn } from "../../resources/functions";
import { AuthorizationEVENTS } from "../../resources/constants";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  username: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      username: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: "login",
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.data?.status?.success) {
        dispatchCustomEventFn({ eventName: AuthorizationEVENTS.SET_USER_ID, eventData: { user_id: data?.data?.userData?.user_id } });
      }
    },
  });

  function onSubmit(values) {
    mutate(values);
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="h-1/2 w-2/5 rounded-md flex flex-col items-center p-4 bg-gray-400">
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
        <div onClick={() => navigate("/signup")}>Go to Signup</div>
        <div className="login-btn-group mt-10">
          <button onClick={handleSubmit(onSubmit)} type="button" disabled={isPending} className="bg-gray-600 text-white rounded-md h-12 w-full">
            {isPending ? "Please wait" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
