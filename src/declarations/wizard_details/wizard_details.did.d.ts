import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Analytics = { 'v1' : Analytics_V1 };
export interface Analytics_V1 { 'messagesReplied' : bigint }
export type Error = { 'UnableToUploadAvatar' : null } |
  { 'PrincipalIdMissMatch' : null } |
  { 'AgentNotFound' : null } |
  { 'UserNotAuthorized' : null };
export interface InitialArgs {
  'owner' : Principal,
  'userManagementCanisterId' : Principal,
  'elnaImagesCanisterId' : Principal,
}
export interface Main {
  'addWizard' : ActorMethod<[WizardDetails], Response>,
  'addWizardLaunchpad' : ActorMethod<[WizardDetailsV3], Result>,
  'deleteWizard' : ActorMethod<[string], Response>,
  'getAllAnalytics' : ActorMethod<[], Array<[string, Analytics]>>,
  'getAllWizards' : ActorMethod<[], Array<WizardDetailsWithTimeStamp>>,
  'getAnalytics' : ActorMethod<[string], Analytics_V1>,
  'getElnaBackendUri' : ActorMethod<[], string>,
  'getLaunchpadOwner' : ActorMethod<[], string>,
  'getUserWizards' : ActorMethod<
    [string],
    Array<WizardDetailsBasicWithCreatorName>
  >,
  'getWizard' : ActorMethod<[string], [] | [WizardDetails]>,
  'getWizards' : ActorMethod<[], Array<WizardDetailsBasicWithCreatorName>>,
  'isWizardNameValid' : ActorMethod<[string], boolean>,
  'publishWizard' : ActorMethod<[string], Response>,
  'unpublishWizard' : ActorMethod<[string], Response>,
  'updateLaunchpadOwner' : ActorMethod<[Principal], string>,
  'updateMessageAnalytics' : ActorMethod<[string], undefined>,
  'updateWizard' : ActorMethod<[string, WizardUpdateDetails], string>,
  'updateWizardAdmin' : ActorMethod<[string, string], string>,
  'updateWizardLaunchpad' : ActorMethod<
    [
      string,
      {
        'tokenAddress' : string,
        'userId' : string,
        'agentId' : string,
        'poolAddress' : string,
      },
    ],
    Result
  >,
}
export interface Response { 'status' : bigint, 'message' : string }
export type Result = { 'ok' : string } |
  { 'err' : Error };
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
export interface WizardDetailsBasicWithCreatorName {
  'id' : string,
  'isPublished' : boolean,
  'userId' : string,
  'name' : string,
  'createdAt' : Time,
  'biography' : string,
  'description' : string,
  'creatorName' : string,
  'updatedAt' : Time,
  'avatar' : string,
}
export interface WizardDetailsV3 {
  'id' : string,
  'isPublished' : boolean,
  'tokenAddress' : [] | [string],
  'userId' : string,
  'name' : string,
  'biography' : string,
  'greeting' : string,
  'description' : string,
  'summary' : [] | [string],
  'poolAddress' : [] | [string],
  'visibility' : WizardVisibility,
  'avatar' : string,
}
export interface WizardDetailsWithTimeStamp {
  'id' : string,
  'isPublished' : boolean,
  'userId' : string,
  'name' : string,
  'createdAt' : Time,
  'biography' : string,
  'greeting' : string,
  'description' : string,
  'summary' : [] | [string],
  'updatedAt' : Time,
  'visibility' : WizardVisibility,
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
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
