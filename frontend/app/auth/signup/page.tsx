"use client";
import Image from "next/image";
import logo from "@/icons/logo.png";
import CustomInput from "@/components/custom-input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/icons/bg.jpg";
import Link from "next/link";
export default function Signup() {
  return (
    <div className="md:mt-30">
      <div className="md:grid grid md:grid-cols-[40%_60%]  max-w-7xl  mx-auto border border-gray-400 md:rounded-3xl overflow-hidden">
        <div className="p-6">
          <Image src={logo} alt="No Logo" />
          <div className="flex flex-col  items-center my-20 px-15">
            <div className="w-full">
              <div className="md:text-3xl text-3xl font-semibold"> Signup</div>
              <div className="md:text-sm text-gray-500 mt-1">
                Signup to enjoy feature of HD
              </div>
            </div>

            <CustomInput label="Your Name" />
            <DatePicker />
            <CustomInput label="Email" />
            <CustomInput label="OTP" />
            <Button className=" w-full bg-blue-500 text-white py-6 mt-5 hover:bg-blue-600">
              Sign Up
            </Button>
            <div className="flex gap-2 mt-5 items-center">
              <h2>Already have an account??</h2>
              <Link className="text-blue-500 underline " href="/auth/signin">
                Sign in
              </Link>
            </div>
          </div>
        </div>
        <div className="border border-red-500 hidden md:block">
          <Image
            src={backgroundImage}
            alt="Background"
            className=" object-cover h-full "
          />
        </div>
      </div>
    </div>
  );
}
