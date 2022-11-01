function add_data(...args) { asm_data_section.push(...args.map(x => x + "\n")) }
function add_text(...args) { asm_text_section.push(...args.map(x => x + "\n")) }

global.autolblctr = 0
function getAutoLabel(a = 0) {
    autolblctr += a;
    return (`__ALLOC_${autolblctr - a}__`)
}

function static_allocate(type) {
    add_data(getAutoLabel(0) + ": " + type.designator)
    return getAutoLabel(1)
}

function static_allocate_buffer(size, type) {
    add_data(`.comm ${getAutoLabel(0)}, ${size}, ${type.bytes}`)
    return getAutoLabel(1)
}

function static_allocate_initArray(size, type, data) {
    var build = data.map((x,ind) => type.designator + " " + data[ind])
    return newAsmVar(getAutoLabel(1), type, data[0] + "\n" + build.slice(1).join("   \n"))
}


function setMemory(dest, fmt, src) {
    var regUsed = fmtReg("b", fmt)
    // add_text(
    //     `mov ${regUsed}, ${src} `,
    //     `mov${fmt.postfix} ${dest}, ${regUsed}`
    // )
    // if(rawtype(fmt).special == "pointer") {
    // add_text(
    //     moveInto("b", )
    //     `mov ${dest}, ${regUsed}`)

    // } else {
    add_text(
        moveInto("b", fmt, src),
        `mov ${dest}, ${regUsed}`
    )
    //}
}

function setMemoryBase(dest, fmt, src) {
    add_text(
        `lea %ebx, ${src} `,
        `mov ${dest}, %ebx`
    )
}

function asmLabel(label) {
    return label + ":"
}

function newAsmVar(dest, fmt, src) {
    variables[dest] = fmt
    add_data(`${asmLabel(dest)} ${fmt.designator} ${src}`)
    return dest
}

function QUICKSTR(str) {
    return '"' + str + '"'
}

function READPTR(p) {
    return `[${p}]`
}