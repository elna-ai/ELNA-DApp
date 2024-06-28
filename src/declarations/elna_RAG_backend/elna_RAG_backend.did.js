export const idlFactory = ({ IDL }) => {
  const Envs = IDL.Record({
    'external_service_url' : IDL.Text,
    'wizard_details_canister_id' : IDL.Text,
    'vectordb_canister_id' : IDL.Text,
  });
  const Body = IDL.Record({ 'response' : IDL.Text });
  const Response = IDL.Record({ 'body' : Body, 'statusCode' : IDL.Nat16 });
  const Error = IDL.Variant({
    'CantParseHost' : IDL.Null,
    'BodyNonSerializable' : IDL.Null,
    'ParseError' : IDL.Null,
    'HttpError' : IDL.Text,
  });
  const Result = IDL.Variant({ 'Ok' : Response, 'Err' : Error });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const Result_1 = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
  });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
  });
  const HttpHeader = IDL.Record({ 'value' : IDL.Text, 'name' : IDL.Text });
  const HttpResponse = IDL.Record({
    'status' : IDL.Nat,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HttpHeader),
  });
  const TransformArgs = IDL.Record({
    'context' : IDL.Vec(IDL.Nat8),
    'response' : HttpResponse,
  });
  return IDL.Service({
    'chat' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Float32), IDL.Text],
        [Result],
        [],
      ),
    'delete_collections_' : IDL.Func([IDL.Text], [Result_1], []),
    'get_file_names' : IDL.Func([IDL.Text], [Result_2], []),
    'transform' : IDL.Func([TransformArgs], [HttpResponse], ['query']),
  });
};
export const init = ({ IDL }) => {
  const Envs = IDL.Record({
    'external_service_url' : IDL.Text,
    'wizard_details_canister_id' : IDL.Text,
    'vectordb_canister_id' : IDL.Text,
  });
  return [Envs];
};
