import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Loader from './Loader';

interface Props {
  ASTRO_FRONTEND_URL: string;
  ASTRO_BACKEND_URL: string;
}

const LoginForm = (props: Props) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = [...new FormData(e.target as HTMLFormElement)]
      .reduce((a: any, [key, value]: any) => {
        a[key] = value;
        return a;
      }, {});

    const res = await axios.post(`${props.ASTRO_BACKEND_URL}/api/users-permissions/auth/local`, {
      ...formData
    }).then((res) => {
      const { jwt } = res.data;
      setLoading(false);
      sessionStorage.setItem('jwt', jwt);
      setResponseMessage(res.data.message ?? "");
      if(jwt)
        location.replace(props.ASTRO_FRONTEND_URL + location.hash.substring(1));
    }).catch((err) => {
      setResponseMessage(err.response.data.error.message);
      setLoading(false);
    });
  }

  return (
    <div>
      <form className="flex flex-col justify-center" onSubmit={login}>
        <div className="my-2">
          <label className="font-bold mb-5 mr-3">Email</label>
          <input 
            type="email"
            id="email"
            name="identifier"
            className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700"
            autoComplete="off"
          ></input>
        </div>
        <div className="my-2">
          <label className=" font-bold mb-5">Password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            className="text-sm outline-none pb-5 w-full border-b rounded-md hover:border-blue-700 focus:border-blue-700"
            autoComplete="off"
          ></input>
        </div>
        {responseMessage && <p className="text-red-500">{responseMessage}</p>}
        <button type="submit" className={`self-center text-custom-200 bg-custom-300 w-1/2 rounded-md py-2`}>{loading ? <Loader class="relative m-auto " /> : "Login"}</button>
      </form>
      <p>Not a member? <a href={`/register${location.hash}`}>Click here to register.</a></p>
      <p>Forgot your password? <a href='/send-email'>Click here to reset it.</a></p>
    </div>
  )
}

export default LoginForm;