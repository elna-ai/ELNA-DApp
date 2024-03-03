import {
  Error,
  Result,
} from "declarations/elna_RAG_backend/elna_RAG_backend.did";

export const isErr = (response: Result): response is { Err: Error } =>
  Object.keys(response).includes("Err");
