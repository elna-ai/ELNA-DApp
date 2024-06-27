export const idlFactory = ({ IDL }) => {
  const DeveloperStatus = IDL.Variant({
    'disabled' : IDL.Null,
    'approved' : IDL.Null,
  });
  const Developer = IDL.Record({
    'id' : IDL.Text,
    'status' : DeveloperStatus,
    'principal' : IDL.Principal,
    'alias' : IDL.Text,
    'email' : IDL.Text,
    'github' : IDL.Text,
  });
  const DeveloperApprovalStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const DeveloperApproval = IDL.Record({
    'id' : IDL.Text,
    'status' : DeveloperApprovalStatus,
    'principal' : IDL.Principal,
    'alias' : IDL.Text,
    'description' : IDL.Text,
    'email' : IDL.Text,
    'github' : IDL.Text,
  });
  const Backend = IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'approvePendingDeveloper' : IDL.Func([IDL.Text], [IDL.Text], []),
    'enableDeveloperAccess' : IDL.Func([IDL.Text], [IDL.Text], []),
    'generateUserToken' : IDL.Func([], [IDL.Text], []),
    'getDevelopers' : IDL.Func([], [IDL.Vec(Developer)], ['query']),
    'getPendingDevelopers' : IDL.Func([], [IDL.Vec(DeveloperApproval)], []),
    'getUserRequests' : IDL.Func([], [IDL.Vec(DeveloperApproval)], ['query']),
    'getUserToken' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'getWhitelistedUser' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'isDeveloper' : IDL.Func([], [IDL.Bool], []),
    'isPrincipalAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'isUserAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isCreator' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [IDL.Bool],
        ['query'],
      ),
    'rejectPendingDeveloper' : IDL.Func([IDL.Text], [IDL.Text], []),
    'removeAdmin' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'removeWhitelistedUser' : IDL.Func([IDL.Principal], [IDL.Text], []),
    'requestDeveloperAccess' : IDL.Func([DeveloperApproval], [IDL.Bool], []),
    'revokeDeveloperAccess' : IDL.Func([IDL.Text], [IDL.Text], []),
    'whitelistUser' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
  return Backend;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
