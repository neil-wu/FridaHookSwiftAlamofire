
export class SDSwiftDataStorage {
    // https://github.com/apple/swift-corelibs-foundation/blob/60fb6984c95b989bb25b3af26accd3a2dc2e2240/Sources/Foundation/Data.swift#L82
    // Swift DataStorage is a class type.
    // Foundation.__DataStorage
    // https://github.com/TannerJin/Swift-MemoryLayout/blob/master/Swift/Class.swift
    __dataStoragePtr: NativePointer;
    bytesPtr: NativePointer 
    length: UInt64
    capacity: UInt64

    constructor(ptr: NativePointer) {
        /*
            ----Swift Class Memory Layout----
            var isa: objc_class* (8 bytes)
            var refCount: UInt64 (8 bytes)
            [properties]
        */
        this.__dataStoragePtr = ptr;
        
        let tmpptr = ptr.add(8 + 8);
        this.bytesPtr = new NativePointer( tmpptr.readU64() );

        tmpptr = tmpptr.add(8);
        this.length = tmpptr.readU64();

        tmpptr = tmpptr.add(8);
        this.capacity = tmpptr.readU64();
    }

    desc():string {
        return `<Swift.DataStorage, bytesPtr=${this.bytesPtr}, length='${this.length}'>`;
    }
}
