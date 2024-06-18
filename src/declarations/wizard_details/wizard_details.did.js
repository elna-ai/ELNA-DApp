export const idlFactory = ({ IDL }) => {
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
  const WizardDetailsBasic = IDL.Record({
    'id' : IDL.Text,
    'isPublished' : IDL.Bool,
    'userId' : IDL.Text,
    'name' : IDL.Text,
    'biography' : IDL.Text,
    'description' : IDL.Text,
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
        [IDL.Vec(WizardDetailsBasic)],
        ['query'],
      ),
    'getWizard' : IDL.Func([IDL.Text], [IDL.Opt(WizardDetails)], ['query']),
    'getWizards' : IDL.Func([], [IDL.Vec(WizardDetailsBasic)], ['query']),
    'isWizardNameValid' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'publishWizard' : IDL.Func([IDL.Text], [Response], []),
    'unpublishWizard' : IDL.Func([IDL.Text], [Response], []),
    'updateMessageAnalytics' : IDL.Func([IDL.Text], [], []),
    'updateWizard' : IDL.Func([IDL.Text, WizardUpdateDetails], [IDL.Text], []),
  });
  return Main;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
