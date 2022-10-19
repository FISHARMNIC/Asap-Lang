function rawtype(t) {
    if (parseInt(t) == t) {
        t = parseInt(t);
        if (t > 65535) return typesJSON.num.subtypes["32"]
        else if (t > 255) return typesJSON.num.subtypes["16"]
        else return typesJSON.num.subtypes["8"]
    } else if(Object.keys(variables).includes(t)) {
        return variables[t]
    }
    else {
        //console.log(t)
        if(t == "num" || t == "str") {
            return typesJSON[t].subtypes[typesJSON[t].default]
        } else if ((t.includes("num") || t.includes("str")) && t.includes(":")) {
            var parsed = [t.slice(0,t.indexOf(":")),t.slice(t.indexOf(":") + 1)]
            //console.log(parsed)
            return typesJSON[parsed[1]].subtypes[parsed[0]]
        } else if (t[0] == "%") {
            if (t.includes("e")) {
                return typesJSON.num.subtypes["32"]
            } else if (t.includes("x")) {
                return typesJSON.num.subtypes["16"]
            } else {
                return ypesJSON.num.subtypes["8"]
            }
        }
        return typesJSON.str.subtypes[typesJSON.str.default]
    }
}

function isVariable(_name) {
    return Object.keys(variables).includes(_name) || String(_name).includes("%")
}

function createLocal(_name) {
    newAsmVar(asmLabel(LOCAL(_name)), rawtype("num"), "0")
}

function moveInto(regletter, type, val)
{
    //console.log(rawtype(val))
    if(rawtype(val).pointer)
        return `lea %e${regletter}x, ${val}`
    return `mov ${fmtReg(regletter, type)}, ${val}`
}

function moveIntoPrevent8bit(regletter, type, val)
{
    //console.log(rawtype(val))
    if(rawtype(val).pointer)
        return `lea %e${regletter}x, ${val}`
    return `mov ${fmtRegPrevent8bit(regletter, type)}, ${val}`
}

function fmtReg(letter, t) {
    //console.log(letter)
    return t.register.replace("_", letter)
}

function fmtRegPrevent8bit(letter, t) {
    var o = t.register.replace("_", letter)
    return o[2] == "l" || o[2] == "h" ? `%${letter}x` : o
}
function char(str) {
    return str.charCodeAt(0)
}