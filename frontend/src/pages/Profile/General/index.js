import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

const General = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      profile_pic: null,
    },
  });

  return (
    <div className="bg-white w-full m-4 rounded-xl flex flex-col gap-5 p-5">
      <div className="mt-5 pb-4 border-b flex w-full">
        <div className="font-medium text-lg">General Settings</div>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-36 h-36 cursor-pointer bg-white group relative select-none">
            <img
              className="w-full h-full rounded-full object-contain"
              src={watch("profile_pic") ? URL.createObjectURL(watch("profile_pic")) : ""}
              alt="profile_pic"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="font-medium text-base">Profile Picture</div>
            <div className="text-gray-500 text-sm">PNG, JPEG under 5MB</div>
          </div>
        </div>

        <div className="flex gap-4">
          <label htmlFor="profile_pic" className="border rounded-md px-2 py-3 cursor-pointer bg-customBlue">
            Upload new picture
            <Controller
              name="profile_pic"
              control={control}
              render={({ field }) => {
                return (
                  <input
                    id="profile_pic"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]);
                      e.target.value = null;
                    }}
                    hidden
                  />
                );
              }}
            />
          </label>
          <div className="border rounded-md px-2 py-3 cursor-pointer bg-customBlue">Delete</div>
        </div>
      </div>
    </div>
  );
};

export default General;

// https://dribbble.com/shots/22737318-Propwise-Account-Settings-Page-Property-Management-Web-App
