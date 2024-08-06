import React from "react";
import { Controller, useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa";

const General = () => {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      profile_pic: null,
    },
  });
  console.log(watch("profile_pic"));

  return (
    <div className="bg-white w-full m-4 rounded-xl flex flex-col p-5">
      <div className="w-full flex flex-col items-center justify-center gap-4">
        <div className="w-52 h-52 cursor-pointer bg-white group relative select-none">
          <img
            className="w-full h-full rounded-full object-contain"
            src={watch("profile_pic") ? URL.createObjectURL(watch("profile_pic")) : ""}
            alt="profile_pic"
          />

          <div
            className=" cursor-pointer max-w-fit absolute top-2 right-4 group-hover:block"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log("delete");
            }}>
            <FaTrash className="text-red-800" />
          </div>
        </div>
        <label htmlFor="profile_pic" className="border rounded-md px-2 py-4 cursor-pointer bg-customBlue">
          Upload profile picture
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
      </div>
    </div>
  );
};

export default General;
