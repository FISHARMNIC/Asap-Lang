global.fs = require("fs");
function forceImport(file) {
    (1, eval)(String(fs.readFileSync(file)))
}

forceImport(__dirname + "/parser.js")
forceImport(__dirname + "../ASAPcompiler/internal/tdec.js")
forceImport(__dirname + "/predefined.js")

var code = String(fs.readFileSync("/Users/squijano/Documents/Asap/examples/example1/code.a"))
code = code.replace(/[\n\t]/g, "").split(".").map(x => parse(x))

var out = []
var variables = {}
var inFunction = {}

var predefined = {
    return: (val) {
        inFunction
    }
}

for(var line = 0; line < code.length; line++)
{
    var lineConts = code[line]
    for(var wordNum = 0; wordNum < lineConts.length; wordNum++)
    {
        var current = () => lineConts[wordNum]
        var next = () => lineConts[wordNum + 1]
        var prev = () => lineConts[wordNum - 1]

        if(Object.keys(predefined).includes(current))
            predefined[current](lineConts.slice(wordNum, wordNum + predefined[current].length))
    }
}

function isEmptyObj(ob)
{
    return JSON.stringify(ob) == "{}"
}