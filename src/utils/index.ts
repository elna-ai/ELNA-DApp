import { Document } from "langchain/dist/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import * as pdfjsLib from 'pdfjs-dist';
// Import the worker source properly for Vite
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { History } from "declarations/elna_RAG_backend/elna_RAG_backend.did";

import { Message, VariantKeys } from "../types";

type AllowedFileTypes = 
  | "application/pdf"
  | "text/plain"
  | "text/csv"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/json";

export function isAllowedFileType(value: string): value is AllowedFileTypes {
  const allowedTypes: AllowedFileTypes[] = [
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/json",
  ];
  return allowedTypes.includes(value as AllowedFileTypes);
}

export const extractDocumentsFromPDF = async (file: File) => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  const loader = new PDFLoader(file, {
    //  TODO: ignore requried here?
    /* @ts-ignore */
    pdfjs: () => pdfjsLib,
  });
  try {
    const docs = await loader.load();
    return docs;
  } catch (e) {
    console.error(e);
  }
};

export const extractDocumentsFromText = async (file: File) => {
  const loader = new TextLoader(file);
  try {
    const docs = await loader.load();
    return docs;
  } catch (e) {
    console.error(e);
  }
};

export const extractDocumentsFromCSV = async (file: File) => {
  const loader = new CSVLoader(file);
  try {
    const docs = await loader.load();
    return docs;
  } catch (e) {
    console.error(e);
  }
};

export const extractDocumentsFromDOCX = async (file: File) => {
  const loader = new DocxLoader(file);
  try {
    const docs = await loader.load();
    return docs;
  } catch (e) {
    console.error(e);
  }
};

export const extractDocumentsFromJSON = async (file: File) => {
  const loader = new JSONLoader(file);
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

const getHistory = (message: Message) =>
  message.user.isBot
    ? { role: { Assistant: null }, content: message.message }
    : { role: { User: null }, content: message.message };

export const transformHistory = (messages: Message[]): [History, History][] => {
  const history: [History, History][] = [];

  for (let i = 1; i < messages.length - 1; i++) {
    history.push([getHistory(messages[i]), getHistory(messages[i + 1])]);
  }

  return history;
};

export function transformHistoryToMessages(
  nestedArray: [History, History][],
  agentName: string
): Message[] {
  return nestedArray.reduce<Message[]>((acc, conversation) => {
    const transformedMessages = conversation.map(item => {
      const role = convertFromMotokoVariant(item.role);
      return {
        user: {
          name: role === "User" ? "User" : agentName,
          isBot: role !== "User",
        },
        message: item.content,
      };
    });
    return acc.concat(transformedMessages);
  }, []);
}

export const generateTwitterShareLink = (content: string, hashtags: string) =>
  `https://twitter.com/intent/tweet?text=${encodeURI(
    content
  )}&hashtags=${hashtags}`;

export const convertToMotokoOptional = <T>(value: T | undefined): [T] | [] =>
  !!value ? [value] : [];

export const convertFromMotokoOptional = <T>(value: [T] | []) => {
  return value.length > 0 ? value[0] : undefined;
};

export const convertFromMotokoVariant = <T extends object>(
  status: T
): VariantKeys<T> => {
  return Object.keys(status)[0] as VariantKeys<T>;
};

export const convertToMotokoVariant = <T>(
  status: string
): Record<string, null> => {
  const variant: Record<string, null> = {};
  variant[status] = null;
  return variant;
};

export const convertToIDLVariant = <T>(status: VariantKeys<T>) => {
  return { [status]: null } as T;
};
