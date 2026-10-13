import { useRef, useState } from "react";
import { Link, useFetcher, useNavigate, useSearchParams } from "react-router";
import { signUp, login } from "../client/auth";
import { SignupData } from "../client/type";

const GUEST_EMAIL = "goooood26@gmail.com";
const GUEST_PASSWORD = "123456";

export default function AuthForm() {
  const [searchParams] = useSearchParams();
  const isModeSignup = searchParams.get("mode") === "signup";

  const password = useRef<HTMLInputElement>(null);
  const confirmPassword = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [inputError, setInputError] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const authenticate = async (payload: SignupData) => {
    let isSuccess;

    if (isModeSignup) {
      const isPasswordValid =
        password.current!.value === confirmPassword.current!.value;

      if (!isPasswordValid) {
        setInputError("Passwords do not match!");
        return;
      }

      isSuccess = await signUp(payload);
    } else {
      isSuccess = await login(payload);
    }

    if (isSuccess) {
      navigate("/");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(form.current!);
    const rawPayload = Object.fromEntries(formData.entries());

    const payload: SignupData = {
      email: rawPayload.email.toString(),
      password: rawPayload.password.toString(),
    };

    authenticate(payload);
  };

  const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target!.value === "") {
      setInputError("");
    }
  };

  const handleGuestLogin = async () => {
    if (password.current) {
      password.current.value = GUEST_PASSWORD;
    }

    const isSuccess = await login({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    });

    if (isSuccess) {
      navigate("/");
    }
  };

  return (
    <fetcher.Form
      ref={form}
      onSubmit={handleSubmit}
      className="auth-card flex w-full max-w-sm flex-col gap-4 border border-base-300 p-7 text-base-content shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-base-content/10"
    >
      <h1 className="font-mono text-2xl text-center font-semibold">
        #Markdowner
      </h1>
      <h1 className="text-center text-xl ">
        {isModeSignup ? "Sign Up" : "Login"}
      </h1>
      <label className="auth-field flex items-center gap-2 rounded-sm border border-base-300 px-3 py-2 text-base-content">
        <i className="fa-solid fa-user text-base-content/70"></i>
        <input
          type="text"
          name="email"
          className="input input-bordered input-base-100 grow border-0 bg-transparent p-0 text-base-content shadow-none outline-none placeholder:text-base-content/50 focus:outline-none"
          placeholder="Email"
          required
        />
      </label>
      <label className="auth-field flex items-center gap-2 rounded-sm border border-base-300 px-3 py-2 text-base-content">
        <i className="fa-solid fa-lock text-base-content/70"></i>
        <input
          ref={password}
          onInput={handlePasswordInput}
          type="password"
          name="password"
          className="input input-bordered input-base-100 grow border-0 bg-transparent p-0 text-base-content shadow-none outline-none placeholder:text-base-content/50 focus:outline-none"
          placeholder="Password"
          required
        />
      </label>
      {isModeSignup && (
        <div>
          <label className="auth-field flex items-center gap-2 rounded-sm border border-base-300 px-3 py-2 text-base-content">
            <i className="fa-solid fa-lock text-base-content/70"></i>
            <input
              ref={confirmPassword}
              onInput={handlePasswordInput}
              type="password"
              className="input input-bordered input-base-100 grow border-0 bg-transparent p-0 text-base-content shadow-none outline-none placeholder:text-base-content/50 focus:outline-none"
              placeholder="Confirm Password"
              required
            />
          </label>
          {inputError && (
            <span className="ml-5 text-red-700 text-xs font-bold">
              {inputError}
            </span>
          )}
        </div>
      )}

      <button className="btn btn-primary block rounded-sm" type="submit">
        {isModeSignup ? "Sign Up" : "Login"}
      </button>

      <button
        type="button"
        className="btn btn-outline btn-secondary block rounded-sm"
        onClick={handleGuestLogin}
      >
        Continue as Guest
      </button>

      <Link
        to={`?mode=${isModeSignup ? "login" : "signup"}`}
        className="link link-secondary text-center no-underline"
      >
        {isModeSignup ? "Login" : "Sign Up"}
      </Link>
    </fetcher.Form>
  );
}
