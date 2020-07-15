import { log } from "./logger";
import { SDSwiftDataStorage } from "./SDSwiftDataStorage";

let funcptr_data_bridgeToObjectiveC:NativeFunction

// bridge Swift DataStorage to __NSSwiftData: NSData
function swiftDataBridgeToObjectiveC(dataStorage: SDSwiftDataStorage):ObjC.Object {
    let dataLen = dataStorage.length;
    let rangeValue = dataLen.shl(32); // 0..<dataLen
    let rangePtr = new NativePointer(rangeValue);
    return swiftDataBridgeToObjectiveCByPtr(rangePtr, dataStorage.__dataStoragePtr);
}
function swiftDataBridgeToObjectiveCByPtr(rangePtr:NativePointer, dataStoragePtr: NativePointer):ObjC.Object {

    let ret:NativePointer = funcptr_data_bridgeToObjectiveC(rangePtr, dataStoragePtr) as NativePointer;

    let ocret = new ObjC.Object(ret); // is __NSSwiftData: NSData
    let byteptr = ocret.bytes() as NativePointer;
    log(`ocret = ${ ocret.$className }, ${ ocret.description() }, len=${ocret.length()}, byteptr=${byteptr}`);
    let cstr = byteptr.readCString()
    //log(`${cstr}, count ${cstr?.length}`)
    return ocret;
}

function attach() {
    
    // 1. Foundation.Data._bridgeToObjectiveC() -> __C.NSData
    // arg
    // return: __NSSwiftData: NSData // https://github.com/apple/swift-corelibs-foundation/blob/60fb6984c95b989bb25b3af26accd3a2dc2e2240/Sources/Foundation/Data.swift#L561
    
    const func_data2nsdata_ptr = Module.getExportByName(null, '$s10Foundation4DataV19_bridgeToObjectiveCSo6NSDataCyF');
    log(`[SwiftRuntime] func_data2nsdata_ptr ${func_data2nsdata_ptr}`);
    funcptr_data_bridgeToObjectiveC = new NativeFunction(func_data2nsdata_ptr,'pointer', ['pointer', 'pointer']);
    log(`[SwiftRuntime] funcptr_data_bridgeToObjectiveC ${funcptr_data_bridgeToObjectiveC}`);
}

export {
    attach,
    swiftDataBridgeToObjectiveC,
    swiftDataBridgeToObjectiveCByPtr,
}

