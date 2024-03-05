import {
  Error,
  RejectionCode,
  Result,
  Result_1,
} from "declarations/elna_RAG_backend/elna_RAG_backend.did";

// TODO make this a generic function which takes types
export const isErr = (response: Result): response is { Err: Error } =>
  Object.keys(response).includes("Err");

export const isErrGetFileNames = (
  response: Result_1
): response is { Err: [RejectionCode, string] } =>
  Object.keys(response).includes("Err");
