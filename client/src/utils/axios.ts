import axios from "axios";
const customAxios = axios.create({
  baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
});

export default customAxios;
