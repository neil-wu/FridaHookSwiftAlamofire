import { log } from "./logger";
//import * as Util from "./Util";
//import {SDSwiftLargeString, SDSwiftSmallString} from "./SDSwiftString";
//import {SDSwiftDataStorage} from "./SDSwiftDataStorage";
import * as HookURL from "./HookURL";
import * as HookDataTaskWithRequest from "./HookDataTaskWithRequest";
import * as HookAFSessionDelegate from "./HookAFSessionDelegate";
import * as HookAFServerTrust from "./HookAFServerTrust";
import * as SwiftRuntime from "./SwiftRuntime";

log("\n--- loaded --->");

function hasAlamofireModule():boolean {
    let exePath = ObjC.classes.NSBundle.mainBundle().executablePath() as string;
    let modules = Process.enumerateModules();
    for (var i = 0; i < modules.length; i++) {
        let oneModule = modules[i];
        if (oneModule.path.endsWith('Alamofire')) {
            return true;
        }
    }
    return false;
}

log(`hasAlamofireModule ${hasAlamofireModule()}`);

SwiftRuntime.attach();
HookURL.attach();
HookDataTaskWithRequest.attach();
HookAFSessionDelegate.attach();
HookAFServerTrust.attach();
