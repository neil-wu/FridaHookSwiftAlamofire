
function isPrintableChar(val:number):boolean {
    // [A-Za-z0-9_$ ]
    //0-9  0x30-0x39
    //A-Z  0x41-0x5a
    //a-z  97-122
    //0x5f 0x24 0x20
    let isNumber:boolean = (val >= 0x30 && val <= 0x39);
    let isUpper:boolean = (val >= 0x41 && val <= 0x5a);
    let isLower:boolean = (val >= 0x61 && val <= 0x7a);
    let isSpecial:boolean = (val == 0x5f) || (val == 0x24) || (val == 0x20);
    return isNumber || isUpper || isLower || isSpecial;
}

function isPrintableString(str:string):boolean {
    for(var i = 0; i < str.length; i++) {
        let val = str.charCodeAt(i);
        if (!isPrintableChar(val)) {
            return false;
        }
    }
    return true;
}


function hexString(str:string):string {
    var ret:string = "0x";
    for(var i = 0; i < str.length; i++) {
        let val = str.charCodeAt(i);
        var valstr = val.toString(16);
        if (valstr.length == 1) {
            valstr = '0' + valstr;
        }
        ret = ret + valstr;
    }
    return ret;
}

function readUCharHexString(ptr: NativePointer, maxlen:number = 128):string {
    var idx:number = 0;
    var hexStr: string = "";
    while (true) {
        let val = ptr.add(idx).readU8()
        if (val == 0) {
            break;
        }
        var valstr = val.toString(16);
        if (valstr.length == 1) {
            valstr = '0' + valstr;
        }
        hexStr += valstr;
        idx++;
        if (idx >= maxlen) {
            break;
        }
    }

    if (hexStr.length > 0) {
        hexStr = "0x" + hexStr;
    }

    return hexStr;
}

function swapInt16(val: number) {
    return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
}

function swapInt32(val: number) {
    return (
        ((val & 0xff) << 24) |
        ((val & 0xff00) << 8) |
        ((val & 0xff0000) >> 8) |
        ((val >> 24) & 0xff)
    );
}

function hexStrToUIntArray(inputStr:string):number[] {
    var str:string = inputStr
    if (str.startsWith('0x')) {
        str = str.substr(2);
    }
    var hex  = str.toString();
    var result:number[] = [];
    for (var n = 0; n < hex.length; n += 2) {
        result.push(parseInt(hex.substr(n, 2), 16));
    }
    return result;
}
  
function uintArrayToHexStr(array: number[]):string {
    var str:string = "";

    for (var n = 0; n < array.length; n += 1) {
        let val = array[n];
        var valstr = array[n].toString(16);
        if (valstr.length == 1) {
            valstr = '0' + valstr;
        }
        str += valstr;
    }
    if (str.length > 0) {
        str = "0x" + str;
    }
    return str;
}

function getOCMethodName(className:string, funcName: string):any {
    var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');
    return hook
}

export {
    isPrintableChar,
    isPrintableString,
    hexString,
    swapInt16,
    swapInt32,
    readUCharHexString,
    hexStrToUIntArray,
    uintArrayToHexStr,
    getOCMethodName,
}

