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
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: "login",
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatchCustomEventFn({
          eventName: AuthorizationEVENTS.SET_USER_ID,
          eventData: { user_id: data?.data?.data?.user_id, session_id: data?.data?.data?.session_id },
        });
      }
    },
  });

  function onSubmit(values) {
    mutate(values);
  }

  return (
    <div className="flex h-screen bg-gray-200 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md h-2/4 w-2/4 flex flex-col items-center justify-center">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">Login</h2>
        <form className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Controller
              name={"email"}
              control={control}
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Controller
              name={"password"}
              control={control}
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                );
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}>
              {isPending ? "Please wait..." : "Sign In"}
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-sm" type="button" onClick={() => navigate("signup")}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
