import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Backend {
  'addAdmin' : ActorMethod<[Principal], string>,
  'approvePendingDeveloper' : ActorMethod<[string], string>,
  'enableDeveloperAccess' : ActorMethod<[string], string>,
  'generateUserToken' : ActorMethod<[], string>,
  'getDevelopers' : ActorMethod<[], Array<Developer>>,
  'getPendingDevelopers' : ActorMethod<[], Array<DeveloperApproval>>,
  'getUserRequests' : ActorMethod<[], Array<DeveloperApproval>>,
  'getUserToken' : ActorMethod<[Principal], string>,
  'getWhitelistedUser' : ActorMethod<[], Array<Principal>>,
  'isDeveloper' : ActorMethod<[], boolean>,
  'isPrincipalAdmin' : ActorMethod<[Principal], boolean>,
  'isUserAdmin' : ActorMethod<[], boolean>,
  'isUserWhitelisted' : ActorMethod<[[] | [Principal]], boolean>,
  'rejectPendingDeveloper' : ActorMethod<[string], string>,
  'removeAdmin' : ActorMethod<[Principal], string>,
  'removeWhitelistedUser' : ActorMethod<[Principal], string>,
  'requestDeveloperAccess' : ActorMethod<[DeveloperApproval], boolean>,
  'revokeDeveloperAccess' : ActorMethod<[string], string>,
  'whitelistUser' : ActorMethod<[Principal], string>,
}
export interface Developer {
  'id' : string,
  'status' : DeveloperStatus,
  'principal' : Principal,
  'alias' : string,
  'email' : string,
  'github' : string,
}
export interface DeveloperApproval {
  'id' : string,
  'status' : DeveloperApprovalStatus,
  'principal' : Principal,
  'alias' : string,
  'description' : string,
  'email' : string,
  'github' : string,
}
export type DeveloperApprovalStatus = { 'pending' : null } |
  { 'approved' : null } |
  { 'rejected' : null };
export type DeveloperStatus = { 'disabled' : null } |
  { 'approved' : null };
export interface _SERVICE extends Backend {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
