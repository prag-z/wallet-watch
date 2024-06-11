import { Outlet, useLoaderData } from "react-router-dom";

import wave from "../assets/wave.svg";

import Nav from "../components/Nav";

export function mainLoader() {
  return fetch('localhost:5000/get-username')
    .then(response => response.json())
    .then(data => ({ username: data.username }))
    .catch(error => {
      console.error('Error Fetching username', error)
      return { username: null }; 
  });
}

const Main = () => {
  const { userName } = useLoaderData()

  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  )
}
export default Main