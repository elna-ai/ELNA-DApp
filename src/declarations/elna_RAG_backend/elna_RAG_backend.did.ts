// @ts-nocheck
import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Body { 'response' : string }
export interface Envs {
  'external_service_url' : string,
  'wizard_details_canister_id' : string,
  'vectordb_canister_id' : string,
}
export type Error = { 'CantParseHost' : null } |
  { 'BodyNonSerializable' : null } |
  { 'ParseError' : null } |
  { 'HttpError' : string };
export interface HttpHeader { 'value' : string, 'name' : string }
export interface HttpResponse {
  'status' : bigint,
  'body' : Uint8Array | number[],
  'headers' : Array<HttpHeader>,
}
export type RejectionCode = { 'NoError' : null } |
  { 'CanisterError' : null } |
  { 'SysTransient' : null } |
  { 'DestinationInvalid' : null } |
  { 'Unknown' : null } |
  { 'SysFatal' : null } |
  { 'CanisterReject' : null };
export interface Response { 'body' : Body, 'statusCode' : number }
export type Result = { 'Ok' : Response } |
  { 'Err' : Error };
export type Result_1 = { 'Ok' : string } |
  { 'Err' : [RejectionCode, string] };
export type Result_2 = { 'Ok' : Array<string> } |
  { 'Err' : [RejectionCode, string] };
export interface TransformArgs {
  'context' : Uint8Array | number[],
  'response' : HttpResponse,
}
export interface _SERVICE {
  'chat' : ActorMethod<[string, string, Array<number>, string], Result>,
  'delete_collections_' : ActorMethod<[string], Result_1>,
  'get_file_names' : ActorMethod<[string], Result_2>,
  'transform' : ActorMethod<[TransformArgs], HttpResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
