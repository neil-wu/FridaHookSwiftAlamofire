import { log } from "./logger";
import { SDSwiftDataStorage } from "./SDSwiftDataStorage";
import * as SDNetDump from "./SDNetDump";
import * as SwiftRuntime from "./SwiftRuntime";

function enterFuncUrlSessionDidReceive(this: InvocationContext, args: InvocationArguments) {
    // String is parsed by value
    let ptr1 = args[0]; //NSURLSession
    let ptr2 = args[1]; //NSURLSessionDataTask
    let rangePtr = args[2];
    let dataStoragePtr = args[3]; // Foundation.__DataStorage <-> Swift.Data
    

    const session = new ObjC.Object(ptr1); //NSURLSession
    const sessionDataTask = new ObjC.Object(ptr2); //NSURLSessionDataTask
    
    const request = sessionDataTask.currentRequest(); //NSURLRequest
    const dataLen = sessionDataTask.response().expectedContentLength()
    //log(`1112-> ${request} > ${request.URL().absoluteString()}`)

    let output:string = SDNetDump.dumpRequest(request);
    

    //log(`rangePtr = ${ rangePtr }, dataStoragePtr=${dataStoragePtr}`);
    //log(`dataLen=${dataLen}`);

    let sdata = new SDSwiftDataStorage(dataStoragePtr);
    //log(`   ${ sdata.bytesPtr.readCString() }`);
    
    let sdataStr = sdata.bytesPtr.readCString(dataLen); // parse the response data, default as string
    
    output += "\n";
    output += SDNetDump.intent + `>>> ${sdataStr}`;
    log(`${output}`)

    //----
    // you can also use the following function to print Data.
    //SwiftRuntime.swiftDataBridgeToObjectiveCByPtr(rangePtr, dataStoragePtr);
    
} 

function attach() {
    try {
        //Alamofire.SessionDelegate.urlSession(_: __C.NSURLSession, dataTask: __C.NSURLSessionDataTask, didReceive: Foundation.Data) -> ()
        const func_urlSessionDidReceive = Module.getExportByName(null, '$s9Alamofire15SessionDelegateC03urlB0_8dataTask10didReceiveySo12NSURLSessionC_So0i4DataF0C10Foundation0J0VtF');
        log(`[HookAFSessionDelegate] func_urlSession ${func_urlSessionDidReceive}`);
        Interceptor.attach(func_urlSessionDidReceive, { onEnter: enterFuncUrlSessionDidReceive});
    } catch (e) {
        log(`[HookAFSessionDelegate] fail to hook Alamofire.SessionDelegate !, ${e}`);
    }
    
}

export {
    attach,
}

