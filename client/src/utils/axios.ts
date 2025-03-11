import axios from "axios";
const createAxios = ({ headers }: { headers?: Record<string, unknown> }) => {
  const baseURL =
    typeof window == "undefined"
      ? "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
      : "/";
  return axios.create({
    baseURL: baseURL,
    headers: {
      ...(headers as Record<string, unknown>),
    },
  });
};

export default createAxios;
