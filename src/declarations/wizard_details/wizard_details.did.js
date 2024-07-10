export const idlFactory = ({ IDL }) => {
  const InitalArgs = IDL.Record({
    'owner' : IDL.Principal,
    'userManagementCanisterId' : IDL.Principal,
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
  const Analytics_V1 = IDL.Record({ 'messagesReplied' : IDL.Nat });
  const Analytics = IDL.Variant({ 'v1' : Analytics_V1 });
  const Time = IDL.Int;
  const WizardDetailsBasicWithTimeStamp = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'biography' : IDL.Text,
    'description' : IDL.Text,
    'updatedAt' : Time,
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
    'deleteWizard' : IDL.Func([IDL.Text], [Response], []),
    'getAllAnalytics' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Analytics))],
        ['query'],
      ),
    'getAllWizards' : IDL.Func([], [IDL.Vec(WizardDetails)], []),
    'getAnalytics' : IDL.Func([IDL.Text], [Analytics_V1], ['query']),
    'getUserWizards' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(WizardDetailsBasicWithTimeStamp)],
        ['query'],
      ),
    'getWizard' : IDL.Func([IDL.Text], [IDL.Opt(WizardDetails)], ['query']),
    'getWizards' : IDL.Func(
        [],
        [IDL.Vec(WizardDetailsBasicWithTimeStamp)],
        ['query'],
      ),
    'isWizardNameValid' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'publishWizard' : IDL.Func([IDL.Text], [Response], []),
    'unpublishWizard' : IDL.Func([IDL.Text], [Response], []),
    'updateMessageAnalytics' : IDL.Func([IDL.Text], [], []),
    'updateWizard' : IDL.Func([IDL.Text, WizardUpdateDetails], [IDL.Text], []),
  });
  return Main;
};
export const init = ({ IDL }) => {
  const InitalArgs = IDL.Record({
    'owner' : IDL.Principal,
    'userManagementCanisterId' : IDL.Principal,
  });
  return [InitalArgs];
};
