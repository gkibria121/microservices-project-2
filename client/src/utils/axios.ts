import axios from "axios";
import { headers } from "next/headers";
import { getCookie } from "../services/cookie";
const createAxios = async () => {
  if (typeof window !== "undefined") {
    return axios.create({
      baseURL: "/",
      withCredentials: true,
    });
  }

  const reqHeaders = await headers();
  const sessionCookie = await getCookie("session");
  const baseURL =
    "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";

  return axios.create({
    baseURL: baseURL,
    headers: {
      Host: reqHeaders.get("Host"),
      "Content-Type": "application/json",
      Cookie: `session=${sessionCookie?.value}`, // ✅ Correct header for cookies
    },
  });
};

export default createAxios;
