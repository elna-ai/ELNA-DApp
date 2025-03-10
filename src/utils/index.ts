import { Document } from "langchain/dist/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { WebPDFLoader } from "langchain/document_loaders/web/pdf";
import * as pdfJs from "pdfjs-dist";
import pdfJsWorker from "pdfjs-dist/build/pdf.worker";
import { History } from "declarations/elna_RAG_backend/elna_RAG_backend.did";

import { Message, VariantKeys } from "../types";
import { toast } from "react-toastify";

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

export const copyToClipBoard = async (tag: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${tag} copied`);
  } catch (err) {
    toast.error(`Failed to copy ${tag}`);
  }
};

export const returnTimeRemaining = ({
  unixTimestamp = 0,
}: {
  unixTimestamp?: number;
}) => {
  const now = Date.now() / 1000;
  const targetTime = unixTimestamp;
  const remainingTime = targetTime - now;

  if (remainingTime <= 0 || unixTimestamp === 0) return null;

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const timeUnits = [
    { unit: "year", seconds: 31536000 }, // 365 * 24 * 3600
    { unit: "month", seconds: 2592000 }, // 30 * 24 * 3600
    { unit: "day", seconds: 86400 }, // 24 * 3600
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of timeUnits) {
    const value = Math.floor(remainingTime / seconds);
    if (Math.abs(value) > 0) {
      return rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return rtf.format(0, "second");
};
