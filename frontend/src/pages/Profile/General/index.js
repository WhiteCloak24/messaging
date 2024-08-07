import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { userDetails, userUpdate } from "../../../api-service";
import { dispatchCustomEventFn } from "../../../resources/functions";
import { AlertEVENTS, RefetchQuery } from "../../../resources/constants";
import useListingWrapper from "../../../hooks/Apis/useListingWrapper";
import { useMediaResources } from "../../../hooks/useMediaResources";

const isSameFormValues = (value1, value2) => {
  if (!value1 || !value2) {
    return true;
  }
  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);
  if (keys2.length != keys1.length) {
    return false;
  }
  for (let index = 0; index < keys1.length; index++) {
    const element = keys1[index];
    if (value1[element] !== value2[element]) {
      return false;
    }
  }
  return true;
};
const General = () => {
  const { resources } = useMediaResources();
  
  const { data: userData } = useListingWrapper({ queryFn: userDetails, resourceKeys: [{ name: "profile_pic", type: "profile" }] });

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      profile_pic: null,
    },
  });

  useEffect(() => {
    if (userData && Object.keys(userData).length) {
      const { first_name = "", last_name = "", profile_pic = "" } = userData || {};
      reset({
        first_name,
        last_name,
        profile_pic,
      });
    }
  }, [userData]);

  const { mutate: userUpdateMutate, isPending: userUpdateLoading } = useMutation({
    mutationKey: ["userUpdate"],
    mutationFn: userUpdate,
    onSuccess: (data) => {
      if (data?.data?.success) {
        dispatchCustomEventFn({ eventName: AlertEVENTS.ALERT, eventData: { message: data?.data?.message || "", type: "success" } });
        dispatchCustomEventFn({
          eventName: RefetchQuery,
          eventData: {
            queryKey: ["userDetails"],
          },
        });
      }
    },
  });

  function onSubmit(data) {
    const payload = new FormData();
    payload.append("first_name", data.first_name);
    payload.append("last_name", data.last_name);
    payload.append("profile_pic", data.profile_pic);
    userUpdateMutate(payload);
  }
  return (
    <div className="bg-white w-full m-4 rounded-xl flex flex-col gap-5 p-5">
      <div className="mt-5 pb-4 border-b flex w-full">
        <div className="font-medium text-lg">General Settings</div>
      </div>
      <div className="w-full flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-36 h-36 cursor-pointer bg-white group relative select-none">
            <img className="w-full h-full rounded-full object-contain border bg-gray-500" src={resources[watch("profile_pic")]} alt=" " />
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
      <div className="w-full h-full  overflow-auto">
        <div className="w-full flex flex-col justify-between gap-3">
          <div className="font-medium">Full name</div>
          <div className="w-full flex items-center justify-between gap-4">
            <div className="w-full">
              <Controller
                name="first_name"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <div className="text-gray-500">First name</div>
                      <input {...field} className="rounded-md h-12 w-full px-4" type="text" placeholder="Please enter first name" />
                    </>
                  );
                }}
              />
            </div>
            <div className="w-full">
              <Controller
                name="last_name"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <div className="text-gray-500">Last name</div>
                      <input {...field} className="rounded-md h-12 w-full px-4" type="text" placeholder="Please enter last name" />
                    </>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-center gap-4 pt-4 border-t">
        {!isSameFormValues(
          { first_name: watch("first_name"), last_name: watch("last_name"), profile_pic: watch("profile_pic") },
          { first_name: userData?.first_name, last_name: userData?.last_name, profile_pic: userData?.profile_pic }
        ) && (
          <button
            className="border rounded-md px-2 py-3 cursor-pointer min-w-32 bg-customBlue"
            onClick={handleSubmit(onSubmit)}
            disabled={userUpdateLoading}>
            {userUpdateLoading ? "Please wait" : "Update"}
          </button>
        )}
      </div>
    </div>
  );
};

export default General;

// https://dribbble.com/shots/22737318-Propwise-Account-Settings-Page-Property-Management-Web-App
