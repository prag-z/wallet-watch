// rrd imports
import { useLoaderData } from "react-router-dom";

//  helper functions
import Signup from "../components/Signup";

// loader
export function dashboardLoader() {
  return fetch('localhost:5000/get-username')
    .then(response => response.json())
    .then(data => ({ username: data.username }))
    .catch(error => {
      console.error('Error Fetching username', error)
      return { username: null }; 
  });
}

const Dashboard = () => {
  const { username } = useLoaderData()

  return (
    <div>
      <Signup />
    </div>
  )
}
export default Dashboard