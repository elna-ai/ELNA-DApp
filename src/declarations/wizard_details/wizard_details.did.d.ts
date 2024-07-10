import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Analytics = { 'v1' : Analytics_V1 };
export interface Analytics_V1 { 'messagesReplied' : bigint }
export interface InitalArgs {
  'owner' : Principal,
  'userManagementCanisterId' : Principal,
}
export interface Main {
  'addWizard' : ActorMethod<[WizardDetails], Response>,
  'deleteWizard' : ActorMethod<[string], Response>,
  'getAllAnalytics' : ActorMethod<[], Array<[string, Analytics]>>,
  'getAllWizards' : ActorMethod<[], Array<WizardDetails>>,
  'getAnalytics' : ActorMethod<[string], Analytics_V1>,
  'getUserWizards' : ActorMethod<
    [string],
    Array<WizardDetailsBasicWithTimeStamp>
  >,
  'getWizard' : ActorMethod<[string], [] | [WizardDetails]>,
  'getWizards' : ActorMethod<[], Array<WizardDetailsBasicWithTimeStamp>>,
  'isWizardNameValid' : ActorMethod<[string], boolean>,
  'publishWizard' : ActorMethod<[string], Response>,
  'unpublishWizard' : ActorMethod<[string], Response>,
  'updateMessageAnalytics' : ActorMethod<[string], undefined>,
  'updateWizard' : ActorMethod<[string, WizardUpdateDetails], string>,
}
export interface Response { 'status' : bigint, 'message' : string }
export type Time = bigint;
export interface WizardDetails {
  'id' : string,
  'isPublished' : boolean,
  'userId' : string,
  'name' : string,
  'biography' : string,
  'greeting' : string,
  'description' : string,
  'summary' : [] | [string],
  'visibility' : WizardVisibility,
  'avatar' : string,
}
export interface WizardDetailsBasicWithTimeStamp {
  'id' : string,
  'isPublished' : boolean,
  'userId' : string,
  'name' : string,
  'createdAt' : Time,
  'biography' : string,
  'description' : string,
  'updatedAt' : Time,
  'avatar' : string,
}
export interface WizardUpdateDetails {
  'name' : string,
  'biography' : string,
  'greeting' : string,
  'description' : string,
  'visibility' : WizardVisibility,
  'avatar' : string,
}
export type WizardVisibility = { 'privateVisibility' : null } |
  { 'publicVisibility' : null } |
  { 'unlistedVisibility' : null };
export interface _SERVICE extends Main {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
