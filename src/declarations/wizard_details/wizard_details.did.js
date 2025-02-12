export const idlFactory = ({ IDL }) => {
  const InitialArgs = IDL.Record({
    'capCanisterId' : IDL.Principal,
    'owner' : IDL.Principal,
    'userManagementCanisterId' : IDL.Principal,
    'elnaImagesCanisterId' : IDL.Principal,
  });
  const WizardVisibility = IDL.Variant({
    'privateVisibility' : IDL.Null,
    'publicVisibility' : IDL.Null,
    'unlistedVisibility' : IDL.Null,
  });
  const WizardDetails = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'biography' : IDL.Text,
    'greeting' : IDL.Text,
    'description' : IDL.Text,
    'summary' : IDL.Opt(IDL.Text),
    'visibility' : WizardVisibility,
    'avatar' : IDL.Text,
  });
  const Response = IDL.Record({ 'status' : IDL.Nat, 'message' : IDL.Text });
  const WizardDetailsV3 = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'tokenAddress' : IDL.Opt(IDL.Text),
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'biography' : IDL.Text,
    'greeting' : IDL.Text,
    'description' : IDL.Text,
    'summary' : IDL.Opt(IDL.Text),
    'poolAddress' : IDL.Opt(IDL.Text),
    'visibility' : WizardVisibility,
    'avatar' : IDL.Text,
  });
  const Error = IDL.Variant({
    'UnableToUploadAvatar' : IDL.Null,
    'PrincipalIdMissMatch' : IDL.Null,
    'AgentNotFound' : IDL.Null,
    'AgentIdExist' : IDL.Null,
    'UserNotAuthorized' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : Error });
  const Analytics_V2_External = IDL.Record({
    'modificationCount' : IDL.Nat,
    'messagesReplied' : IDL.Nat,
    'uniqueUsers' : IDL.Nat,
  });
  const Time = IDL.Int;
  const WizardDetailsWithTimeStamp = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'biography' : IDL.Text,
    'greeting' : IDL.Text,
    'description' : IDL.Text,
    'summary' : IDL.Opt(IDL.Text),
    'updatedAt' : Time,
    'visibility' : WizardVisibility,
    'avatar' : IDL.Text,
  });
  const WizardDetailsBasicWithCreatorName = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'tokenAddress' : IDL.Opt(IDL.Text),
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'biography' : IDL.Text,
    'description' : IDL.Text,
    'creatorName' : IDL.Text,
    'updatedAt' : Time,
    'poolAddress' : IDL.Opt(IDL.Text),
    'avatar' : IDL.Text,
  });
  const WizardUpdateDetails = IDL.Record({
    'name' : IDL.Text,
    'biography' : IDL.Text,
    'greeting' : IDL.Text,
    'description' : IDL.Text,
    'visibility' : WizardVisibility,
    'avatar' : IDL.Text,
  });
  const Main = IDL.Service({
    'addWizard' : IDL.Func([WizardDetails], [Response], []),
    'addWizardLaunchpad' : IDL.Func([WizardDetailsV3], [Result], []),
    'deleteWizard' : IDL.Func([IDL.Text], [Response], []),
    'getAllAnalytics' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Analytics_V2_External))],
        ['query'],
      ),
    'getAllWizards' : IDL.Func([], [IDL.Vec(WizardDetailsWithTimeStamp)], []),
    'getAnalytics' : IDL.Func([IDL.Text], [Analytics_V2_External], ['query']),
    'getElnaBackendUri' : IDL.Func([], [IDL.Text], ['query']),
    'getLaunchpadOwner' : IDL.Func([], [IDL.Text], ['query']),
    'getUserWizards' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(WizardDetailsBasicWithCreatorName)],
        [],
      ),
    'getWizard' : IDL.Func([IDL.Text], [IDL.Opt(WizardDetails)], ['query']),
    'getWizards' : IDL.Func(
        [],
        [IDL.Vec(WizardDetailsBasicWithCreatorName)],
        [],
      ),
    'isWizardNameValid' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'publishWizard' : IDL.Func([IDL.Text], [Response], []),
    'unpublishWizard' : IDL.Func([IDL.Text], [Response], []),
    'updateLaunchpadOwner' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'updateMessageAnalytics' : IDL.Func([IDL.Text], [], []),
    'updateWizard' : IDL.Func([IDL.Text, WizardUpdateDetails], [IDL.Text], []),
    'updateWizardAdmin' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'updateWizardLaunchpad' : IDL.Func(
        [
          IDL.Text,
          IDL.Record({
            'tokenAddress' : IDL.Opt(IDL.Text),
            'userId' : IDL.Text,
            'agentId' : IDL.Text,
            'poolAddress' : IDL.Opt(IDL.Text),
          }),
        ],
        [Result],
        [],
      ),
  });
  return Main;
};
export const init = ({ IDL }) => {
  const InitialArgs = IDL.Record({
    'capCanisterId' : IDL.Principal,
    'owner' : IDL.Principal,
    'userManagementCanisterId' : IDL.Principal,
    'elnaImagesCanisterId' : IDL.Principal,
  });
  return [InitialArgs];
};
