import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'asset' : string,
  'owner' : Principal,
  'file_name' : string,
}
export type Error = { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'UnableToDelete' : null } |
  { 'UploaderMismatch' : null };
export type Result = { 'Ok' : string } |
  { 'Err' : Error };
export type Result_1 = { 'Ok' : Array<[string, Asset]> } |
  { 'Err' : Error };
export interface _SERVICE {
  'add_asset' : ActorMethod<[Asset, [] | [string]], Result>,
  'delete_asset' : ActorMethod<[string], Result>,
  'get_all_assets' : ActorMethod<[], Result_1>,
  'get_asset' : ActorMethod<[string], [] | [Asset]>,
  'get_owner' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
