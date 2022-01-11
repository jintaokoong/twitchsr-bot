import { axiosInstance } from "./configs/axios";

const create = (sr: string) => {
  return axiosInstance
    .post("/request", {
      name: sr,
    })
    .then(({ data }) => data);
};

export default {
  create,
};
