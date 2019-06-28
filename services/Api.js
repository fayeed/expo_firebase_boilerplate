// a library to wrap and simplify api calls
import apisauce from "apisauce";

// our "constructor"
const create = (baseURL = "") => {
  const api = apisauce.create({
    baseURL,
    headers: {
      "Cache-Control": "no-cache"
    },
    timeout: 10000
  });

  return {};
};

export default {
  create
};
