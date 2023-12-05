import Debug "mo:base/Debug";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";

//import the custom types you have in Types.mo
import Types "Types";

actor {

//PUBLIC METHOD
//This method sends a POST request to a URL with a free API you can test.
  public func send_http_post_request(biography:Text,input_prompt:Text) : async Text {

    //1. DECLARE IC MANAGEMENT CANISTER
    //You need this so you can use it to make the HTTP request
    let ic : Types.IC = actor ("aaaaa-aa");

    //2. SETUP ARGUMENTS FOR HTTP GET request

    // 2.1 Setup the URL and its query parameters
    //This URL is used because it allows you to inspect the HTTP request sent from the canister
    let url = "https://d2f0h5wk28c4fc.cloudfront.net/chat"; //HTTP that accepts IPV6

    // 2.2 prepare headers for the system http_request call

    //idempotency keys should be unique so create a function that generates them.
    let idempotency_key: Text = generateUUID();
    let request_headers = [
        { name = "User-Agent"; value = "http_post_sample" },
        { name= "Content-Type"; value = "application/json" },
        { name= "Idempotency-Key"; value = idempotency_key },
    ];

    // The request body is an array of [Nat8] (see Types.mo) so do the following:
    // 1. Write a JSON string
    // 2. Convert ?Text optional into a Blob, which is an intermediate reprepresentation before you cast it as an array of [Nat8]
    // 3. Convert the Blob into an array [Nat8]

    let request_body_json :Text = "{\"biography\":\""#biography#"\", \"input_prompt\":\""#input_prompt#"\"}";
    // let request_body_json: Text = "{ \"biography\" : \"large language model trained by OpenAI\", \"input_prompt\" : \"say hi to me\" }";
    let request_body_as_Blob: Blob = Text.encodeUtf8(request_body_json); 
    let request_body_as_nat8: [Nat8] = Blob.toArray(request_body_as_Blob); // e.g [34, 34,12, 0]

    // 2.3 The HTTP request
    let http_request : Types.HttpRequestArgs = {
        url = url;
        max_response_bytes = null; //optional for request
        headers = request_headers;
        //note: type of `body` is ?[Nat8] so it is passed here as "?request_body_as_nat8" instead of "request_body_as_nat8"
        body = ?request_body_as_nat8; 
        method = #post;
        // transform = ?transform_context;
        transform = null; //optional for request
    };

    //3. ADD CYCLES TO PAY FOR HTTP REQUEST

    //IC management canister will make the HTTP request so it needs cycles
    //See: https://internetcomputer.org/docs/current/motoko/main/cycles
    
    //The way Cycles.add() works is that it adds those cycles to the next asynchronous call
    //See: https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-http_request
    Cycles.add(21_850_258_000);
    
    //4. MAKE HTTPS REQUEST AND WAIT FOR RESPONSE
    //Since the cycles were added above,youe can just call the IC management canister with HTTPS outcalls below
    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);
    
    //5. DECODE THE RESPONSE

    //As per the type declarations in `Types.mo`, the BODY in the HTTP response 
    //comes back as [Nat8s] (e.g. [2, 5, 12, 11, 23]). Type signature:
    
    //public type HttpResponsePayload = {
    //     status : Nat;
    //     headers : [HttpHeader];
    //     body : [Nat8];
    // };

    //You need to decode that [Na8] array that is the body into readable text. 
    //To do this:
    //  1. Convert the [Nat8] into a Blob
    //  2. Use Blob.decodeUtf8() method to convert the Blob to a ?Text optional 
    //  3. Use Motoko syntax "Let... else" to unwrap what is returned from Text.decodeUtf8()

    let response_body: Blob = Blob.fromArray(http_response.body);
    let decoded_text: Text = switch (Text.decodeUtf8(response_body)) {
        case (null) { "No value returned" };
        case (?y) { y };
    };

    //6. RETURN RESPONSE OF THE BODY
    let result: Text = decoded_text # ". See more info of the request sent at at: " # url # "/inspect";
    result
  };

  //PRIVATE HELPER FUNCTION
  //Helper method that generates a Universally Unique Identifier
  //this method is used for the Idempotency Key used in the request headers of the POST request.
  //For the purposes of this exercise, it returns a constant, but in practice it should return unique identifiers
  func generateUUID() : Text {
    "UUID-123456789";
  }
};
