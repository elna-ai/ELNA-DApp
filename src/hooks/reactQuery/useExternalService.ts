import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Document } from "langchain/document";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

type useLoginMutationProps = {
  token: string;
  principalId: string;
};

type useCreateIndexProps = {
  documents: Document<Record<string, any>>[];
  index_name: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ token, principalId }: useLoginMutationProps) => {
      return axios.post(`${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/login`, {
        user: principalId,
        authcode: token,
      });
    },
    onSuccess: ({ data }) => {
      Cookies.set("external_token", data.access_token, { secure: true });
    },
    onError: error => toast.error(error.message),
  });
};

export const useCreateIndex = () =>
  useMutation({
    mutationFn: (payload: useCreateIndexProps) =>
      axios.post(
        `${import.meta.env.VITE_EXTERNAL_SERVICE_BASE}/create-index`,
        payload,
        { headers: { Authorization: `jwt ${Cookies.get("external_token")}` } }
      ),
    onError: error => {
      toast.error(error.message);
      console.error(error);
    },
  });
