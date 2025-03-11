import axios from "axios";
const createAxios = ({ headers }: { headers: Record<string, unknown> }) => {
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      ...(headers as Record<string, unknown>),
    },
  });
};

export default createAxios;
