import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface DeveloperStudio {
  'approvePendingDeveloperTool' : ActorMethod<[string], string>,
  'getApprovedTools' : ActorMethod<[], Array<DeveloperToolWithCreator>>,
  'getTools' : ActorMethod<[], Array<DeveloperTool>>,
  'getUserTools' : ActorMethod<[], Array<DeveloperTool>>,
  'rejectDeveloperTool' : ActorMethod<[string], string>,
  'requestToolSubmission' : ActorMethod<[DeveloperTool], boolean>,
}
export interface DeveloperTool {
  'id' : string,
  'status' : DeveloperToolStatus,
  'principal' : Principal,
  'name' : string,
  'description' : string,
  'category' : string,
  'projectUrl' : string,
}
export type DeveloperToolStatus = { 'pending' : null } |
  { 'disabled' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export interface DeveloperToolWithCreator {
  'id' : string,
  'status' : DeveloperToolStatus,
  'creator' : string,
  'name' : string,
  'description' : string,
  'category' : string,
  'projectUrl' : string,
}
export interface InitialArgs { 'userManagementCanisterId' : Principal }
export interface _SERVICE extends DeveloperStudio {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
