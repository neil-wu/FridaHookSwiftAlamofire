import { log } from "./logger";

function attach() {
    try {
        // Disable Alamofire ServerTrust policy
        // SessionDelegate func attemptServerTrustAuthentication(with challenge: URLAuthenticationChallenge) -> ChallengeEvaluation
        // Alamofire.SessionDelegate.attemptServerTrustAuthentication(with: __C.NSURLAuthenticationChallenge) -> (disposition: __C.NSURLSessionAuthChallengeDisposition, credential: __C.NSURLCredential?, error: Alamofire.AFError?)
        let func_attemptServerTrust = Module.getExportByName(null, '$s9Alamofire15SessionDelegateC32attemptServerTrustAuthentication4withSo36NSURLSessionAuthChallengeDispositionV11disposition_So15NSURLCredentialCSg10credentialAA7AFErrorOSg5errortSo019NSURLAuthenticationK0C_tF'); // remove prefix _ 
        log(`[HookAFServerTrust] hook func_attemptServerTrust ${func_attemptServerTrust}`);
        Interceptor.attach(func_attemptServerTrust, {
            onLeave(retval:InvocationReturnValue) {
                // force set retval to 0x1 to enable .performDefaultHandling
                
                let val = retval.toInt32();
                if (val != 0x1) {
                    log(`[HookAFServerTrust] attemptServerTrustAuthentication retval ${retval}, reset to 0x1`);
                    let fakeret = new NativePointer(0x1)
                    retval.replace(fakeret)
                }
            }
        });
        
    } catch (e) {
        log(`[HookAFServerTrust] fail to hook attemptServerTrustAuthentication !, ${e}`);
    }
}

export {
    attach,
}


