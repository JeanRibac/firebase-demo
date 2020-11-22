import axios from 'axios';

export default axios.create({
  baseURL: "https://us-central1-firebase-demo-sdbis.cloudfunctions.net/api",
});