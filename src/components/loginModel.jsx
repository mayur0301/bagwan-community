import React, { useState } from "react";
import {
  useLoginAdminMutation,
  useVerifyOtpMutation,
} from "../redux/Admin/AdminApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginModel = () => {
  const [contactNo, setContactNo] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate()

  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const [verifyOtp, { isLoading: otpLoading }] = useVerifyOtpMutation();

  // STEP 1 → SEND OTP
  const handleLogin = async () => {
    if (!contactNo) return toast.error("Enter contact number");

    try {
      await loginAdmin({ ContactNo: contactNo }).unwrap();
      toast.success("OTP sent successfully");
      setShowOtp(true);
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  // STEP 2 → VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      let res = await verifyOtp({
        ContactNo: contactNo,
        otp,
      }).unwrap();
      navigate("/");
      localStorage.setItem("adminToken" , res?.token)
      localStorage.setItem("contact" , contactNo)
      toast.success("Login successful");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b0f0c] w-full">
      
      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center">
        <img
          src="/Logo.png" // same buffalo image
          alt="buffalo"
          className="max-w-[85%] object-contain"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h1 className="text-3xl font-semibold text-white mb-2">
            Login
          </h1>
          <p className="text-gray-400 mb-8">
            Welcome back! Please login to your account.
          </p>

          {/* CONTACT NO */}
          <div className="mb-6">
            <label className="text-xs text-gray-400 tracking-widest">
              CONTACT NO
            </label>
            <input
              type="number"
              placeholder="Enter contact number"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              disabled={showOtp}
              className="w-full bg-transparent border-b border-green-600 text-white py-3 outline-none"
            />
          </div>

          {/* OTP FIELD */}
          {showOtp && (
            <div className="mb-8">
              <label className="text-xs text-gray-400 tracking-widest">
                OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-transparent border-b border-green-600 text-white py-3 outline-none"
              />
            </div>
          )}

          {/* BUTTON */}
          {!showOtp ? (
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-green-800 to-green-400 text-black font-semibold hover:opacity-90 transition"
            >
              {isLoading ? "Sending OTP..." : "Login"}
            </button>
          ) : (
            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-green-800 to-green-400 text-black font-semibold hover:opacity-90 transition"
            >
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModel;