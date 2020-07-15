import {colorfulStr, LogColor} from "./logger"

export const intent:string = "    ";
export const newline:string = "\n";

function dumpRequest(rqst:ObjC.Object):string {
    // rqst=NSMutableURLRequest
    // https://developer.apple.com/documentation/foundation/nsmutableurlrequest?language=objc
    let urlstr = rqst.URL().absoluteString();
    let method = rqst.HTTPMethod().toString(); // NSString
    let bodyData = rqst.HTTPBody();
    let allHTTPHeaderFields = rqst.allHTTPHeaderFields().toString() as string;

    var str:string = "";
    let redMethod = colorfulStr(`[${method}]`, LogColor.Red);
    str += `${redMethod} ${urlstr}`;
    if (allHTTPHeaderFields && allHTTPHeaderFields.length > 0) {
        str += newline;
        str += intent + `[Header] ${allHTTPHeaderFields.replace(newline, "")}`;
    }
    // NSData to NSString
    if (bodyData) {
        var bodydataStr = ObjC.classes.NSString.alloc().initWithData_encoding_(bodyData, 4);
        str += newline;
        str += intent + "[Body] " + bodydataStr;
    }
    return str;
}

function dumpRspWith(data:any, response:any, error:any):string {
    let rsp = new ObjC.Object(response);  
    var dataNSString = ObjC.classes.NSString.alloc().initWithData_encoding_(data, 4);

    let str = intent + `>>> ${dataNSString}`;
    return str;
}

export {
    dumpRequest,
    dumpRspWith,
}

