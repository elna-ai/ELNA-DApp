export const idlFactory = ({ IDL }) => {
  const DeveloperToolStatus = IDL.Variant({
    'pending' : IDL.Null,
    'disabled' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const DeveloperToolWithCreator = IDL.Record({
    'id' : IDL.Text,
    'status' : DeveloperToolStatus,
    'creator' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'category' : IDL.Text,
    'projectUrl' : IDL.Text,
  });
  const DeveloperTool = IDL.Record({
    'id' : IDL.Text,
    'status' : DeveloperToolStatus,
    'principal' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'category' : IDL.Text,
    'projectUrl' : IDL.Text,
  });
  const DeveloperStudio = IDL.Service({
    'approvePendingDeveloperTool' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getApprovedTools' : IDL.Func([], [IDL.Vec(DeveloperToolWithCreator)], []),
    'getTools' : IDL.Func([], [IDL.Vec(DeveloperTool)], []),
    'getUserTools' : IDL.Func([], [IDL.Vec(DeveloperTool)], ['query']),
    'rejectDeveloperTool' : IDL.Func([IDL.Text], [IDL.Text], []),
    'requestToolSubmission' : IDL.Func([DeveloperTool], [IDL.Bool], []),
  });
  return DeveloperStudio;
};
export const init = ({ IDL }) => { return []; };
