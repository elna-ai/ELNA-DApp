import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'asset' : string,
  'owner' : Principal,
  'file_name' : string,
}
export type Error = { 'UnableToReadLastId' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'UnableToDelete' : null } |
  { 'UnableToUpdate' : null } |
  { 'UploaderMismatch' : null };
export type Result = { 'Ok' : string } |
  { 'Err' : Error };
export type Result_1 = { 'Ok' : Array<[string, Asset]> } |
  { 'Err' : Error };
export type Result_2 = { 'Ok' : bigint } |
  { 'Err' : Error };
export interface _SERVICE {
  'add_asset' : ActorMethod<[Asset, [] | [string]], Result>,
  'delete_asset' : ActorMethod<[string], Result>,
  'get_all_assets' : ActorMethod<[], Result_1>,
  'get_asset' : ActorMethod<[string], [] | [Asset]>,
  'get_assets_length' : ActorMethod<[], Result_2>,
  'get_last_id' : ActorMethod<[], Result>,
  'get_owner' : ActorMethod<[], string>,
  'set_last_id' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
