import axios from "axios";
const createAxios = ({
  headers,
}: {
  headers: Record<string, unknown> & {
    get: (arg: string) => string;
  };
}) => {
  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      Host: headers.get("Host"),
      ...(headers as Record<string, unknown>),
    },
  });
};

export default createAxios;
