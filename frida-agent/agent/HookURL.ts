import { log } from "./logger";
import * as Util from "./Util";
import {SDSwiftLargeString, SDSwiftSmallString} from "./SDSwiftString";

function isSmallString(abcdeeee: UInt64):boolean {
    let abcd = abcdeeee.shr(4).and(0xF);
    let isSmall = abcd.and(0x2).valueOf() > 0;
    return isSmall;
}

function enterFuncDataTaskWithRequest(this: InvocationContext, args: InvocationArguments) {
    // String is parsed by value
    let ptr1 = args[0];
    let ptr2 = args[1];

    //log(`ptr ${ptr1}, ${ptr1.toString()}, ${ptr2.toString()} `);
     
    let ptr1hex = '0x' + ptr1.toString(16);
    let ptr2hex = '0x' + ptr2.toString(16);

    let ptr1value = new UInt64(ptr1hex);
    let ptr2value = new UInt64(ptr2hex);
    let smallObject = ptr2value.and(0xFF); // the last byte
    
    // first, try parse smallstring
    if (isSmallString(smallObject)) {
        let smallStr = new SDSwiftSmallString(ptr1hex, ptr2hex);
        log(`[Foundation.URL.init] a=${smallStr.desc()}`)
        if (Util.isPrintableString(smallStr.strValue)) { //TODO: filter special char
            log(`[Foundation.URL.init] ${smallStr.desc()}`)
            return;
        }
        
    }
    
    // Large String
    const countAndFlagsBitsPtr = args[0];    // 8 bytes(_countAndFlagsBits) 
    const objectPtr = args[1];   // 8 bytes(_object)

    let countAndFlagsBits = new UInt64('0x' + countAndFlagsBitsPtr.toString(16))
    let object = new UInt64('0x' + objectPtr.toString(16));
    //log(`[Foundation.URL.init] arg ptr=${countAndFlagsBitsPtr} ,${objectPtr} -> ${objectPtr.toString(16)}`);
    //log(`countAndFlagsBits=0x${countAndFlagsBits.toString(16) } , object=0x${object.toString(16) }`);

    let largeStr = new SDSwiftLargeString(countAndFlagsBits, object);
    log(`[Foundation.URL.init] ${largeStr.desc()}`)
}


function attach() {
    try {
        // s10Foundation3URLV6stringACSgSSh_tcfC ---> Foundation.URL.init(string: __shared Swift.String) -> Foundation.URL?
        let func_Foundation_URL_init = Module.getExportByName(null, '$s10Foundation3URLV6stringACSgSSh_tcfC'); // remove prefix _
        console.log('func_Foundation_URL_init', func_Foundation_URL_init)
        Interceptor.attach(func_Foundation_URL_init, { onEnter: enterFuncDataTaskWithRequest });
    } catch (e) {
        log(`[HookURL] fail to hook swift Foundation.URL.init !, ${e}`);
    }
}

export {
    attach,
}

