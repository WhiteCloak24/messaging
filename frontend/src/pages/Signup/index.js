import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signup } from "../../api-service";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { AlertEVENTS } from "../../resources/constants";
import { dispatchCustomEventFn } from "../../resources/functions";

const validationSchema = yup.object().shape({
  email: yup.string().email("Must be a valid email").required("Email is required"),
  user_name: yup.string().required("User name is required"),
  password: yup.string().required("Password is required"),
});

const Signup = () => {
  const navigate = useNavigate();

  const { handleSubmit, control } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
      user_name: "",
      password: "",
    },
  });
  const { mutate, isPending } = useMutation({
    mutationKey: "signup",
    mutationFn: signup,
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatchCustomEventFn({ eventName: AlertEVENTS.ALERT, eventData: { message: data?.data?.message || "" } });
      }
    },
  });

  function onSubmit(values) {
    mutate(values);
  }

  return (
    <div className="flex h-screen bg-gray-200 items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md h-2/4 w-2/4 flex flex-col items-center justify-center">
        <h2 className="text-gray-800 text-2xl font-semibold mb-4">Sign Up</h2>
        <form className="w-full">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              User Name
            </label>
            <Controller
              name={"user_name"}
              control={control}
              render={({ field }) => {
                return (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your user name"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                );
              }}
            />
          </div>
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
              {isPending ? "Please wait..." : "Sign Up"}
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-sm" type="button" onClick={() => navigate("/")}>
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
