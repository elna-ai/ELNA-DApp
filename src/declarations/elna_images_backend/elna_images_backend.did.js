export const idlFactory = ({ IDL }) => {
  const Asset = IDL.Record({
    'asset' : IDL.Text,
    'owner' : IDL.Principal,
    'file_name' : IDL.Text,
  });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'UnableToDelete' : IDL.Null,
    'UploaderMismatch' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : Error });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Text, Asset)),
    'Err' : Error,
  });
  return IDL.Service({
    'add_asset' : IDL.Func([Asset, IDL.Opt(IDL.Text)], [Result], []),
    'delete_asset' : IDL.Func([IDL.Text], [Result], []),
    'get_all_assets' : IDL.Func([], [Result_1], ['query']),
    'get_asset' : IDL.Func([IDL.Text], [IDL.Opt(Asset)], ['query']),
    'get_owner' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
