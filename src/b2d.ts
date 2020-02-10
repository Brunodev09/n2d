import _ from "./tools/Terminal";
import { dict, order } from "./dictionary";

import { Receives } from "./types";


export class b2d {
    static setPrefix(index: number, len: number) {
        switch (index) {
            case 0: return order[len];
            case 1: return order[len - 1];
            case 2: return order[len - 2];
            case 3: return order[len - 3];
            case 4: return order[len - 4];
            case 5: return order[len - 5];
            default: throw new Error("Really? Please stick to numbers in the order of quadrillion.");
        }
    }

    static translate(numbers: string[], prefix?: string) {
        let concat = "";

        if (numbers.length <= 2) {
            if (dict[numbers.join("")]) return dict[numbers.join("")];
            if (prefix)`${prefix} ${dict[numbers[0] + "0"]} ${dict[numbers[1]]}`;
            return `${dict[numbers[0] + "0"]} ${dict[numbers[1]]}`;
        }
        if (!prefix || !prefix.length) prefix = "";
        if (dict[numbers[1]] === "zero" && dict[numbers[2]] === "zero") return prefix;
        concat = dict[numbers[1]] === "zero" ? dict[numbers[2]] : Number(numbers[1]) < 2 ? dict[numbers[1] + numbers[2]] : dict[numbers[1] + "0"];
        if (dict[numbers[2]] !== "zero" && dict[numbers[1]] !== "zero" && Number(numbers[1]) >= 2) concat += ` ${dict[numbers[2]]}`;
        return `${prefix}${concat}`.includes("zero") ? "" : `${prefix}${concat}`;
    }


    static progressionCheck(str: string[]) {
        for (let char of str) {
            if (char !== "0") return true;
        }
        return false;
    }

    static addAnd(str: string) {
        return str.concat(' and ');
    }

    static cleanString(str: string) {
        return str.replace(/\./gim, "");
    }

    static convert(input: Receives): string {
        let prefix: string = "";
        let finalString = "";

        input = b2d.cleanString(String(input));

        if (input[0] === "0") return dict[0];
        const len = ((<string>input).length / 3).toFixed(1);

        if (isNaN(input as any) || !(<string>input).length) {
            throw new Error("Please enter a valid int > 0.");
        }

        let tripletsArr = [];
        let it = 0;
        let tripletsIndex = 0;

        for (let i = (<string>input).length - 1; i >= 0; i--) {
            if (it === 3) {
                tripletsIndex++;
                it = 0;
            }
            if (!Array.isArray(tripletsArr[tripletsIndex])) tripletsArr[tripletsIndex] = [];
            tripletsArr[tripletsIndex].push(input[i]);
            it++;
        }

        tripletsArr = tripletsArr.reverse();
        let rCounter = 0;
        for (let e of tripletsArr) {
            tripletsArr[rCounter] = e.reverse();
            rCounter++;
        }
        console.log(tripletsArr)

        let index = 0;
        for (let triple of tripletsArr) {
            if (tripletsArr[index].length <= 2) {
                finalString = `${b2d.translate(triple)} `;
                if (index !== tripletsArr.length - 1) finalString += `${b2d.setPrefix(index, tripletsArr.length)} `;
                index++;
                if (tripletsArr.length === 1) break;
                else {
                    if (finalString[finalString.length - 1] !== "") finalString += " ";
                    continue;
                }
            }
            let aux = [];
            if (triple[0] === "0" && triple[1] === "0" && triple[2] === "0") {
                aux = triple;
                index++;
                continue;
            }
            else {
                finalString += `${b2d.translate([triple[0]])} hundred `;
                aux = triple.length > 1 ? triple.slice(1) : triple
            }
            if (!b2d.progressionCheck(aux)) {
                if (tripletsArr.length === 1 || index === tripletsArr.length - 1) break;
                else {
                    finalString += ` ${b2d.setPrefix(index, tripletsArr.length)}`;
                    if (finalString[finalString.length - 1] !== "") finalString += " ";
                    index++;
                    continue;
                }
            }
            
            finalString += ' ';
            if (triple.length > 1) finalString += `${b2d.translate(triple, prefix)}`;
            if (index !== tripletsArr.length - 1) finalString += ` ${b2d.setPrefix(index, tripletsArr.length)}`;
            index++;
            if (finalString[finalString.length - 1] !== "") finalString += " ";
        }
        finalString = finalString.replace(/zero hundred/gim, "");
        finalString = finalString.replace(/\s+/gim, " ");
        finalString = finalString.replace(/hundred hundred/gim, "hundred");

        return finalString;
    }
}