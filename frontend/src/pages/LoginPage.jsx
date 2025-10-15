import React, { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Custom hook
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="min-h-screen flex bg-gray-100 items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg flex w-[900px] max-w-5xl overflow-hidden">
        {/* Left side */}
        <div className="w-1/2 bg-cover bg-center flex flex-col justify-end p-8 text-white relative">
          <img src="/Tree.png" alt="tree" />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-l-2xl"></div>
          <div className="relative z-10">
            <h2 className="text-lg font-semibold italic mb-2">
              “Build your family story together”
            </h2>
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          {/* Error message if any */}
          {error && (
            <div className=" alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Login your <span className="text-purple-600">FamilyTree</span>{" "}
              account
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Start building your family tree today.
            </p>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jordan@gmail.com"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  required
                />
                <p className="block text-sm font-medium text-gray-700">
                  password must be at least 6 characters long
                </p>
              </div>
              {/* TERMS & CONDITIONS */}
              <div className=" form-control">
                <label className=" label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className=" checkbox checkbox-sm"
                    required
                  />
                  <span className=" text-xs text-gray-700">
                    I agree to the{" "}
                    <span className=" text-secondary hover:underline">
                      terms of service
                    </span>{" "}
                    and{" "}
                    <span className=" text-secondary hover:underline">
                      privacy policy
                    </span>
                  </span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className=" loading loading-spinner loading-sm"></span>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
            <div className=" text-center mt-4">
              <p className=" text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
