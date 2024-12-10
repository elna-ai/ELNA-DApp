import {
  Error,
  RejectionCode,
  Result_1,
  Result_3,
  _SERVICE

} from "declarations/elna_RAG_backend/elna_RAG_backend.did";
import { elna_RAG_backend  } from "declarations/elna_RAG_backend";

// TODO make this a generic function which takes types
export const isErr = (response: Result_1): response is { Err: Error } =>
  Object.keys(response).includes("Err");

export const isErrGetFileNames = (
  response: Result_3
): response is { Err: [RejectionCode, string, string] } =>
  Object.keys(response).includes("Err");
