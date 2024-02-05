import { Document } from "langchain/dist/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import * as pdfJs from "pdfjs-dist";
import pdfJsWorker from "pdfjs-dist/build/pdf.worker";

import { AVATAR_IMAGES } from "../constants";
import { Message } from "../types";

export const getAvatar = (id: string) =>
  AVATAR_IMAGES.find(avatar => avatar.id === id);

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

export const transformHistory = (messages: Message[]) => {
  return messages.map(({ user, message }) =>
    user.isBot
      ? { role: "assistant", content: message }
      : { role: "user", content: message }
  );
};

export const generateTwitterShareLink = (content: string) =>
  `https://twitter.com/intent/tweet?text=${encodeURI(
    content
  )}&hashtags=AIagentActivated,ELNAai,DecentralizedAl,GenerativeAl,ICP`;
