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
    <div className="bg-gray-200 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
        <h2 className="text-gray-800 text-2xl font-semibold mb-6 text-center">Login</h2>
        <form>
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
                    id="email"
                    placeholder="Enter your email"
                    className="appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <Controller
              name={"password"}
              control={control}
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    className="appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 sm:mb-0 w-full sm:w-auto">
              {isPending ? "Please wait..." : "Sign In"}
            </button>
            <button type="button" onClick={() => navigate("signup")} className="text-gray-600 hover:text-gray-700 text-sm w-full sm:w-auto text-center">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
