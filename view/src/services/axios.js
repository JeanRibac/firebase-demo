import axios from 'axios';

export default axios.create({
  baseURL: "https://europe-west1-firebase-demo-sdbis.cloudfunctions.net/api",
});