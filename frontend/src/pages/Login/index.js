import React from "react";
import { Controller, useForm } from "react-hook-form";

const Login = () => {
  const { handleSubmit, control, getValues } = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  function sendOTPHandler() {
    const { email } = getValues();
    console.log(email);
  }
  return (
    <div className="h-full flex items-center justify-center">
      <dev className="h-1/2 w-2/5 rounded-md flex flex-col items-center p-4 bg-gray-400">
        <div className="text-black font-bold text-4xl mt-5">Login</div>
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
        <div className="w-full mt-2">
          <div className="font-medium text-xl text-black mb-2">Enter OTP</div>
          <input className="h-12" type="number" name="" id="" />
        </div>
        <div className="login-btn-group mt-10">
          <button type="button" className="bg-gray-600 text-white rounded-md h-12 w-full" onClick={sendOTPHandler}>
            Send OTP
          </button>
          <button type="button" className="bg-gray-600 text-white rounded-md h-12 w-full">
            Verify
          </button>
        </div>
      </dev>
    </div>
  );
};

export default Login;
