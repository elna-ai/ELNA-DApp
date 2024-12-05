import { Document } from "langchain/dist/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import * as pdfJs from "pdfjs-dist";
import pdfJsWorker from "pdfjs-dist/build/pdf.worker";
import { History } from "declarations/elna_RAG_backend/elna_RAG_backend.did";

import { Message } from "../types";

export const extractDocumentsFromPDF = async (file: File) => {
  const loader = new WebPDFLoader(file, {
    //  TODO: ignore requried here?
    /* @ts-ignore */
    pdfjs: () => {
      pdfJs.GlobalWorkerOptions.workerSrc = pdfJsWorker;
      return pdfJs;
    },
  });
  try {
    const docs = await loader.load();
    return docs;
  } catch (e) {
    console.error(e);
  }
};

export const getChunks = async (document: Document<Record<string, any>>[]) => {
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const output = await splitter.splitDocuments(document);
  return output;
};

/**
 *Merge words in the text that have been split with a hyphen.
 */
export const mergeHyphenatedWords = (text: string): string =>
  text.replace(/(\w)-\n(\w)/g, "$1$2");

/**
 * Replace single newline characters in the text with spaces.
 */
export const fixNewlines = (text: string): string =>
  text.replace(/(?<!\n)\n(?!\n)/g, " ");

/**
 * Reduce multiple newline characters in the text to a single newline.
 */
export const removeMultipleNewlines = (text: string): string =>
  text.replace(/\n{2,}/g, "\n");

export const transformHistory = (messages: Message[]): History[] => {
  return messages.map(({ user, message }) =>
    user.isBot
      ? { role: { Assistant: null }, content: message }
      : { role: { User: null }, content: message }
  );
};

export const generateTwitterShareLink = (content: string, hashtags: string) =>
  `https://twitter.com/intent/tweet?text=${encodeURI(
    content
  )}&hashtags=${hashtags}`;

export const convertToMotokoOptional = <T>(value: T | undefined): [T] | [] =>
  !!value ? [value] : [];

export const convertFromMotokoOptional = <T>(value: [T] | []) => {
  return value.length > 0 ? value[0] : undefined;
};
  export const convertFromMotokoVariant = <T extends object>(status: T): string => {
    return Object.keys(status)[0];
  };
  
  export const convertToMotokoVariant = <T>(status: string): Record<string, null> => {
    const variant: Record<string, null> = {};
    variant[status] = null;
    return variant;
  };
