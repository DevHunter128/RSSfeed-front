import React, { useState } from "react";
import axios from "axios";
import "../Signin/index.css";
import { Link, useNavigate } from "react-router-dom";
import md5 from "md5";
import {
  BASE_URL,
} from "../../config";

export default function Signin() {
  const navigate = useNavigate();
  const [form, setform] = useState({ email: "", password: "" });
  const onChangeHandler = (event) => {
    setform({
      ...form,
      [event.target.name]: event.target.value,
    });
  };
  const handlesubmit_login = (e) => {
    e.preventDefault();
    const hash = md5(form.password);
    setform({
      ...form,
      password: hash,
    });
    const formData = { ...form };
    try{
      axios
      .post(`${BASE_URL}/api/auth/login`, formData)
      .then((response) => {
        const token = response.data.token;
        console.log(response.data);
        // Save token to localStorage
        localStorage.setItem("user-token", JSON.stringify(token));
        localStorage.setItem("user", JSON.stringify(response.data.user));

        window.location.reload(false);
        setTimeout(() => {
          navigate("/");
          // setIsLoading(false);
        }, 1000);
      })
      .catch((err) => {
        var errs = err.response.data.message;
        if (errs === "Invalid credentials---password" || errs === "Invalid credentials---email") {
          handleClick();
        } else {
          alert("other error");
        }
      });
    } catch(err){
      console.log('err');
    }
    
  };
  const [showAlert, setShowAlert] = useState(false);
  
  const handleClick = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const Alert = ({ message, onClose }) => {
    return (
      <div className="fixed top-0 right-0 m-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="text-white hover:text-red-200">
            &times;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      {}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handlesubmit_login}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                onChange={onChangeHandler}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                onChange={onChangeHandler}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            {showAlert && <Alert message="Confirm your email and password!" onClose={handleCloseAlert} />}
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a account?{" "}
          <Link
            to="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
