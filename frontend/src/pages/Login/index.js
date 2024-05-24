import React from "react";

const Login = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="h-1/2 w-2/5 rounded-md flex flex-col items-center p-4 bg-gray-400">
        <div className="text-black font-bold text-4xl mt-5">Login</div>
        <div className="mt-8 w-full">
          <div className="font-medium text-xl text-black mb-2">Enter Email</div>
          <input className="h-12" type="email" name="" id="" />
        </div>
        <div className="w-full mt-2">
          <div className="font-medium text-xl text-black mb-2">Enter OTP</div>
          <input className="h-12" type="number" name="" id="" />
        </div>
        <div className="login-btn-group mt-10">
          <button className="bg-gray-600 text-white rounded-md h-12 w-full">Resend OTP</button>
          <button className="bg-gray-600 text-white rounded-md h-12 w-full">Verify</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
