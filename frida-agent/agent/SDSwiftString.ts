
import * as Util from "./Util";

class SDSwiftLargeString {
    // https://github.com/TannerJin/Swift-MemoryLayout/blob/master/SwiftCore/String.swift

    _countAndFlagsBits: UInt64
    _object: UInt64

    isASCII: boolean
    isNFC: boolean
    isNativelyStored: boolean
    isTailAllocated: boolean

    count: number
    strValue: string

    constructor(inCountAndFlag: UInt64, inObject: UInt64) {
        this._countAndFlagsBits = inCountAndFlag;
        this._object = inObject;

        // 1. parse _countAndFlagsBits
        let abcd = inCountAndFlag.shr(48).shr(12).and(0xF); // 16bits, 2bytes
        this.isASCII = abcd.and(0x8).valueOf() > 0;
        this.isNFC = abcd.and(0x4).valueOf() > 0;
        this.isNativelyStored = abcd.and(0x2).valueOf() > 0;
        this.isTailAllocated = abcd.and(0x1).valueOf() > 0;

        this.count = inCountAndFlag.and( 0xFFFFFFFFFFFF ).valueOf(); // 48bits,6bytes

        // 2. parse _object
        let objectFlag = inObject.shr(56).and(0xFF); // abcdeeee
        let tmpaddr = inObject.and('0xFFFFFFFFFFFFFF').toString(16);
        //console.log('tmpaddr', tmpaddr, inObject, inObject.and( '0xFFFFFFFFFFFFFF' ))
        let strAddress = new UInt64('0x' +  tmpaddr) ; // low 56 bits
        
        let strPtr = new NativePointer(strAddress);
        let cstrPtr = strPtr.add(32);
        this.strValue = cstrPtr.readCString() ?? "";
        //console.log('str', this.strValue)
        //console.log(hexdump(cstrPtr.readByteArray(32) as ArrayBuffer, { ansi: true }));
    }

    desc():string {
        return `<Swift.String(Large), count=${this.count}, str='${this.strValue}'>`;
    }
}

class SDSwiftSmallString { 
    strValue: string
    count:number
    isHex:boolean
    constructor(h1: string, h2: string) {
        // small string max 15 bytes
        let h1Array = Util.hexStrToUIntArray(h1).reverse();
        let h2Array = Util.hexStrToUIntArray(h2).reverse();
        //console.log('h1array', h1,  h1Array)
        //console.log('h2array', h2, h2Array)
        function isValidChar(element:number, index:number, array:number[]) { 
            return (element > 0); 
        }
        let dataArr = h1Array.concat(h2Array).slice(0, 15);
        
        let data = dataArr.filter(isValidChar);
        let str = String.fromCharCode.apply(null, data);
        if (Util.isPrintableString(str)) {
            this.strValue = str;
            this.count = str.length;
            this.isHex = false;
        } else {
            this.strValue = Util.uintArrayToHexStr(dataArr)
            this.count = dataArr.length;
            this.isHex = true;
        }
        
    }

    desc():string {
        let hexTip = this.isHex ? "hex" : "str";
        return `<Swift.String(Small), count=${this.count}, ${hexTip}='${this.strValue}'>`;
    }
}

export {
    SDSwiftSmallString,
    SDSwiftLargeString,
}
