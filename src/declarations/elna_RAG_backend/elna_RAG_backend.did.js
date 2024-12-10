export const idlFactory = ({ IDL }) => {
  const Envs = IDL.Record({
    'external_service_url' : IDL.Text,
    'wizard_details_canister_id' : IDL.Text,
    'vectordb_canister_id' : IDL.Text,
    'embedding_model_canister_id' : IDL.Text,
  });
  const RejectionCode = IDL.Variant({
    'NoError' : IDL.Null,
    'CanisterError' : IDL.Null,
    'SysTransient' : IDL.Null,
    'DestinationInvalid' : IDL.Null,
    'Unknown' : IDL.Null,
    'SysFatal' : IDL.Null,
    'CanisterReject' : IDL.Null,
  });
  const Result = IDL.Variant({
    'Ok' : IDL.Text,
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
  });
  const Roles = IDL.Variant({
    'System' : IDL.Null,
    'User' : IDL.Null,
    'Assistant' : IDL.Null,
  });
  const History = IDL.Record({ 'content' : IDL.Text, 'role' : Roles });
  const Body = IDL.Record({ 'response' : IDL.Text });
  const Response = IDL.Record({ 'body' : Body, 'statusCode' : IDL.Nat16 });
  const Error = IDL.Variant({
    'CantParseHost' : IDL.Null,
    'BodyNonSerializable' : IDL.Null,
    'ParseError' : IDL.Null,
    'HttpError' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : Response, 'Err' : Error });
  const Result_2 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Float32),
    'Err' : IDL.Tuple(RejectionCode, IDL.Text),
  });
  const Result_3 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Text),
    'Err' : IDL.Tuple(RejectionCode, IDL.Text, IDL.Text),
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
    'build_index' : IDL.Func([IDL.Text], [Result], []),
    'chat' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Float32),
          IDL.Text,
          IDL.Vec(IDL.Tuple(History, History)),
        ],
        [Result_1],
        [],
      ),
    'create_collection' : IDL.Func([IDL.Text, IDL.Nat64], [Result], []),
    'create_index' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat64,
          IDL.Vec(IDL.Text),
          IDL.Vec(IDL.Vec(IDL.Float32)),
          IDL.Text,
        ],
        [Result],
        [],
      ),
    'delete_collection_from_db' : IDL.Func([IDL.Text], [Result], []),
    'embedding_model' : IDL.Func([IDL.Text], [Result_2], []),
    'get_db_file_names' : IDL.Func([IDL.Text], [Result_3], []),
    'insert_data' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Vec(IDL.Vec(IDL.Float32)), IDL.Text],
        [Result],
        [],
      ),
    'search' : IDL.Func([IDL.Text, IDL.Text, IDL.Int32], [Result], []),
    'transform' : IDL.Func([TransformArgs], [HttpResponse], ['query']),
  });
};
export const init = ({ IDL }) => {
  const Envs = IDL.Record({
    'external_service_url' : IDL.Text,
    'wizard_details_canister_id' : IDL.Text,
    'vectordb_canister_id' : IDL.Text,
    'embedding_model_canister_id' : IDL.Text,
  });
  return [Envs];
};
