import { useRef, useState } from "react";
import { Link, useFetcher, useNavigate, useSearchParams } from "react-router";
import { signUp, login } from "../client/auth";
import { SignupData } from "../client/type";

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

  return (
    <fetcher.Form
      ref={form}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm bg-white/10 rounded-md shadow-lg bg-clip-padding backdrop-filter backdrop-blur-[2px] bg-opacity-0 border border-white/20 p-7"
    >
      <h1 className="text-center text-2xl font-bold">
        {isModeSignup ? "Sign Up" : "Login"}
      </h1>
      <label className="input input-bordered input-base-100 flex items-center gap-2 rounded-full">
        <i className="fa-solid fa-user"></i>
        <input
          type="text"
          name="email"
          className="grow"
          placeholder="Email"
          required
        />
      </label>
      <label className="input input-bordered input-base-100 flex items-center gap-2 rounded-full">
        <i className="fa-solid fa-lock"></i>
        <input
          ref={password}
          onInput={handlePasswordInput}
          type="password"
          name="password"
          className="grow"
          placeholder="Password"
          required
        />
      </label>
      {isModeSignup && (
        <div>
          <label className="input input-bordered input-base-100 flex items-center gap-2 rounded-full">
            <i className="fa-solid fa-lock"></i>
            <input
              ref={confirmPassword}
              onInput={handlePasswordInput}
              type="password"
              className="grow"
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

      <button className="btn btn-primary block rounded-full" type="submit">
        {isModeSignup ? "Sign Up" : "Login"}
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
