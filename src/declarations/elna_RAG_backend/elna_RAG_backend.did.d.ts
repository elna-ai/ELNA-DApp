import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Body { 'response' : string }
export type DetailValue = { 'I64' : bigint } |
  { 'U64' : bigint } |
  { 'Vec' : Array<DetailValue> } |
  { 'Slice' : Uint8Array | number[] } |
  { 'Text' : string } |
  { 'True' : null } |
  { 'False' : null } |
  { 'Float' : number } |
  { 'Principal' : Principal };
export interface Envs {
  'external_service_url' : string,
  'wizard_details_canister_id' : string,
  'cap_canister_id' : string,
  'vectordb_canister_id' : string,
  'embedding_model_canister_id' : string,
}
export type Error = { 'CantParseHost' : null } |
  { 'BodyNonSerializable' : null } |
  { 'ParseError' : null } |
  { 'HttpError' : string };
export interface History { 'content' : string, 'role' : Roles }
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
export type Result = { 'Ok' : string } |
  { 'Err' : [RejectionCode, string] };
export type Result_1 = { 'Ok' : Response } |
  { 'Err' : Error };
export type Result_2 = { 'Ok' : Array<string> } |
  { 'Err' : [RejectionCode, string, string] };
export type Result_3 = { 'Ok' : Array<[History, History]> } |
  { 'Err' : Error };
export type Result_4 = { 'Ok' : null } |
  { 'Err' : [RejectionCode, string] };
export type Roles = { 'System' : null } |
  { 'User' : null } |
  { 'Assistant' : null };
export interface TransformArgs {
  'context' : Uint8Array | number[],
  'response' : HttpResponse,
}
export interface _SERVICE {
  'build_index' : ActorMethod<[string], Result>,
  'chat' : ActorMethod<
    [string, string, [] | [Array<number>], string],
    Result_1
  >,
  'create_collection' : ActorMethod<[string, bigint], Result>,
  'create_index' : ActorMethod<
    [string, bigint, Array<string>, Array<Array<number>>, string],
    Result
  >,
  'delete_collection_from_db' : ActorMethod<[string], Result>,
  'delete_history' : ActorMethod<[string], undefined>,
  'embedding_model' : ActorMethod<[string], Array<number>>,
  'get_db_file_names' : ActorMethod<[string], Result_2>,
  'get_history' : ActorMethod<[string], Result_3>,
  'insert_data' : ActorMethod<
    [string, Array<string>, Array<Array<number>>, string],
    Result
  >,
  'log' : ActorMethod<
    [Principal, string, Array<[string, DetailValue]>],
    Result_4
  >,
  'search' : ActorMethod<[string, Array<number>, number], Result>,
  'test' : ActorMethod<[string], Result_4>,
  'transform' : ActorMethod<[TransformArgs], HttpResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
