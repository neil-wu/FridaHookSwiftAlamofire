export function log(message: string): void {
    console.log(message);
}

export enum LogColor {
    RESET = "\x1b[39;49;00m",
    Black = "0;01", Blue = "4;01", Cyan = "6;01", Gray = "7;11", Green = "2;01", Purple = "5;01", Red = "1;01", Yellow = "3;01",
    /*Light: {
        Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
    }*/
}


export function colorfulStr(input: string, color: LogColor ): string {
    let colorPrefix = '\x1b[3';
    let colorSuffix = 'm';
    
    let str = colorPrefix + color + colorSuffix + input + LogColor.RESET;
    return str;
}



