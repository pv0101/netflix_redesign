import Head from "next/head";
import Image from "next/legacy/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types";
import useAuth from "../hooks/useAuth";

// provide Types
interface Inputs {
  email: string;
  password: string;
}

function Login() {
  const [login, setLogin] = useState(false); //track if user wants to login or sign up
  const {signIn, signUp} = useAuth() //use our useAuth hook for signining in and signing up

  // from react-hook-form. for submitting email and password, error handling 
  const {
    register,
    handleSubmit,
    // watch, don't need this 
    formState: { errors },
  } = useForm<Inputs>();


  //  from react-hook-form. modified function we want to execute. Can destructure data and get email, password directly
  const onSubmit: SubmitHandler<Inputs> = async ({email, password}) => {
    if (login) {
      await signIn(email, password)
    }
    else {
      await signUp(email, password)
    }
  }

  return (
    // Image has layout="fill" so parent needs to be relative or absolute
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Background Image */}
      <Image
        // supposed to use shortened url rb.gy/p2hphi but I get an upstream 403 error. Used full url. Put in full url hostname in next.config.js
        src="https://assets.nflxext.com/ffe/siteui/vlv3/d0982892-13ac-4702-b9fa-87a410c1f2da/519e3d3a-1c8c-4fdb-8f8a-7eabdbe87056/AE-en-20220321-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
      />
      {/* Netflix Logo */}
      <img
        src="https://rb.gy/ulxxee"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        height={150}
      />

      {/* Login Form */}
      <form
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">Sign In</h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              placeholder="Email"
              className="input"
                // register your input into the hook by invoking the "register" function 
              // include validation with required or other standard HTML validation rules 
              {...register("email", { required: true })}
            // email is an option because Type was provided up top.
            // required: true makes it so that the input must be an email
            />
             {/* errors will return when field validation fails. Can put this anywhere but we want error message to show up right below input box so we place code here  */}
             {errors.email && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Please enter a valid email.
              </p>
            )}
          </label>
          <label className="inline-block w-full">
            <input 
            type="password" 
            placeholder="Password" 
            className="input" 
            {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="p-1 text-[13px] font-light  text-orange-500">
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>
        
        {/* If user clicks on Sign In setLogin(true) because user wants to login */}
        <button 
        className="w-full rounded bg-[#e50914] py-3 font-semibold" 
        onClick={() => setLogin(true)}
        >
          Sign In
        </button>

        <div className="text-[gray]">
          New to Netflix?{" "}
          {/* If click on Sign up now user does not want to login so setLogin(false) */}
          <button 
          type="submit" 
          className="text-white hover:underline"
          onClick={() => setLogin(false)}
          >
            Sign up now
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
