import { log } from "./logger";
import * as Util from "./Util";
import * as SDNetDump from "./SDNetDump";



function enterFuncDataTaskWithRequest(this: InvocationContext, args: InvocationArguments) {
    //const ptr = args[0]; 
    const ptr2 = args[2]; 
    const rqst = new ObjC.Object(ptr2); // rqst=NSMutableURLRequest
    let rqstDesc = SDNetDump.dumpRequest(rqst);
    // https://github.com/theart42/hack.lu/blob/master/IOS/Notes/02-HTTPS/00-https-hooks.md

    let ptr3 = args[3];
    if (ptr3.toInt32() <= 0) {
        var str:string = rqstDesc;
        str += "\n";
        str += SDNetDump.intent + "(completionHandler empty)";
        log(`${str}`)
        return;
    }

    var completionHandler = new ObjC.Block(args[3]);
    var origCompletionHandlerBlock = completionHandler.implementation;
    
    completionHandler.implementation = function(data, response, error){
        var str:string = rqstDesc;
        str += "\n";
        str += SDNetDump.dumpRspWith(data, response, error);
        log(`${rqstDesc}`);
        return origCompletionHandlerBlock(data, response, error);
    }
}


function attach() {
    const hookDataTask = Util.getOCMethodName('NSURLSession', '- dataTaskWithRequest:completionHandler:');
    log(`hook NSURLSession ${hookDataTask.implementation}`);

    Interceptor.attach(hookDataTask.implementation, {
        onEnter : enterFuncDataTaskWithRequest,
    });

}



export {
    attach,
}


