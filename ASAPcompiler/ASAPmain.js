global.fs = require("fs");
function forceImport(file) {
    (1, eval)(String(fs.readFileSync(file)))
}


global.asm_data_section = [
    `.include "../../ASAPasmlibs/framework/stackHandler.s"\n`,
    `.include "../../ASAPasmlibs/framework/malloc.s"\n`,
    `.include "../../ASAPasmlibs/framework/strings.s"\n`,
    `.include "../../ASAPasmlibs/framework/langUtils.s"\n`,
    `.include "../../ASAPasmlibs/stdio.s"\n`,
]

//limactl shell debian
// remove returning values in the stack, takes up memory and not being used I think
/*
reseved:
    eax: math
    ebx: can result in unexpected
    ecx: return
    edx: anything
*/
global.asm_text_section = []

global.typesJSON = JSON.parse(fs.readFileSync(__dirname +"/data/types.json"))
global.allFuncsJSON = JSON.parse(fs.readFileSync(__dirname +"/data/methods.json"))
global.typeNUM = typesJSON.num.subtypes
global.typeSTR = typesJSON.str.subtypes

global.variables = {} 
global.parameterStack = []
global.inFunction = 0;
global.useForceCast = 0;

global.precedence = { '^': 3, '*': 2, '/': 2, '<': 2, '>': 2, '+': 1, '-': 1 };

forceImport(__dirname + "/internal/asmFn.js");
forceImport(__dirname +"/internal/tdec.js");
forceImport(__dirname +"/ASAPmethods.js");
forceImport(__dirname + "/ASAPmath.js")
forceImport(__dirname + "/ASAPparser.js")

newAsmVar("_cast_ptrnum_", rawtype("ptr:num"), 0)
newAsmVar("_cast_8num_", rawtype("8:num"), 0)
newAsmVar("_cast_16num_", rawtype("16:num"), 0)
newAsmVar("_cast_32num_", rawtype("32:num"), 0)
newAsmVar("_return_int_", rawtype("32:num"), 0)
newAsmVar("_return_char_", rawtype("8:num"), 0)

variables.strconcat = {rtype: rawtype("ptr:num"), parameters: []}
variables.gets = {rtype: rawtype("ptr:num"), parameters : []}
variables.put_string = {rtype: rawtype("32:num"), parameters : []}
variables.put_int = {rtype: rawtype("32:num"), parameters : []}

// SETVAR("VGAp", 0xb8000)
// SETIND("VGAp", char('A'))

// PROC(0, "num", "main")
// CALL(1, "put_int", MEVAL(5, 1, "+", 2, "+", 3))
// RETURN(1, 0)

//SETVAR("name", CALL(0, "gets"));

//SETVAR("byte", CAST("32:num", LITERAL("abc")))
//SETVAR("newstring", STRJOIN(LITERAL("hi"), LITERAL(" world")))

formatAndRunTXT("/Users/squijano/Documents/Asap/examples/example1/simple.aspm");



fs.writeFileSync("asm/out.s",
`.intel_syntax
.org 0x100
.global _kernel_entry
.section .data
${asm_data_section.join("")}
.section .text
_kernel_entry:
mov %eax, %esp
sub %eax, FRAME_OFFSET
mov _stack_d2_, %eax
_shift_stack_left_
call main
_shift_stack_right_
hlt
${asm_text_section.join("")}
`)
console.log(asm_data_section.join("") + "\n//---\n" + asm_text_section.join(""))



