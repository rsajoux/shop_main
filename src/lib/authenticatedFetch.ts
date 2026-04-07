import axios from "axios";

export const authenticatedFetch = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});
