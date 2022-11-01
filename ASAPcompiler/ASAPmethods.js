function DIMENSION(size, ...varg) {
    useForceCast = `ptr:num`
    return static_allocate_initArray(size, rawtype(varg[0]), varg.slice(0, size))
}

function SETVAR(v, set) {
    // if not defined, declare
    var type = rawtype(set)
    if (!Object.keys(variables).includes(v)) {
        //console.log("-------" + v)

        if (isVariable(set)) {
            newAsmVar(v, type, 0)
            setMemory(v, type, set)
        } else {
            if(type.designator == ".asciz" || type.designator == ".ascii") {
                var dest = LITERAL(set)
                newAsmVar(v, type, 0)
                add_text(moveInto(v, type, dest))
            } else {
            newAsmVar(v, type, set)
            }
        }
        variables[v] = type
    } else {
        setMemory(v, type, set)
    }

}

function CALL(size, func, ...par) {
    par = par.slice(0, size)
    for (i = 0; i < size; i++) {
        var type = fmtReg("b", rawtype(par[i]))
        //console.log("UIEHFEEI", par[i], rawtype(par[i]))
        add_text(
            `xor %ebx, %ebx`,
            moveInto("b", rawtype(par[i]), par[i]),
            `push %ebx`)
        //parameterStack.push(rawtype(par[i]))
    }
    //console.log(variables[func].rtype.register)
    add_text(
        `_shift_stack_left_`,
        `call ${func}`,
        `_shift_stack_right_`,
        )//`pop %ecx`)
    return (fmtReg("c", variables[func].rtype))
}

function LITERAL(str) {
    variables[getAutoLabel()] = typeNUM.ptr;
    newAsmVar(getAutoLabel(), typeSTR.zt, QUICKSTR(str))
    return getAutoLabel(1)
}

function PROC(number_of_par, returnType, _name, ...par) {
    par = par.slice(0, number_of_par)
    variables[_name] = { rtype: rawtype(returnType), parameters: [] }
    inFunction = _name

    add_text(asmLabel(_name))
    add_text("_shift_stack_right_")
    if (number_of_par > 0) {
        for (var i = 0; i < number_of_par; i++) {
            createLocal(par[i])
            variables[_name].parameters.push(par[i])
            add_text(
                `pop %ebx`,
                `movw ${LOCAL(par[i])}, %ebx`,)

        }
    }
}

function LOCAL(_name) {
    return `__${inFunction}_${_name}__`
}

function RETURN(num, ...args) {
    for (i = 0; i < num; i++) {
        var type = fmtReg("c", variables[inFunction].rtype)
        //console.log("REJNEIWJrpfeiufj", type, type[1] == "l" || type[1] == "h")
        add_text(
            `xor %ecx, %ecx`,
            `mov ${type}, ${args[i]}`,
            `push %ecx`)
    }
    add_text("_shift_stack_left_", "ret")
}



function CAST(type, value) {

    add_text(
        `xor %edx, %edx`,
        `mov ${fmtReg("d", rawtype(value))}, ${value}`,
    )
    // if(rawtype(type).pointer) {
    //     add_text(
    //         moveInto("d", rawtype("ptr:num"), value),
    //         `mov _cast_ptrnum_, %edx`)
    //     return `_cast_ptrnum_`
    // }
    // add_text(moveInto("d", rawtype(value), value))
    return (fmtReg("d", rawtype(type)))
}

function STRJOIN(len, s1, s2) {
    CALL(2, "strconcat", s1, s2)
    return "%ecx"
}

function POINTER(fmt, ptr) {
    add_text(
        moveInto("d", rawtype(ptr), ptr),
        `mov ${fmtReg("b", rawtype(fmt))}, [${fmtReg("d", rawtype(ptr))}]`
    )
    return fmtReg("b", rawtype(fmt))
}

function SETIND(dest, ptr) {
    add_text(
        moveInto("b", rawtype(ptr), ptr),
        moveInto("d", rawtype(dest), dest),
        `mov [%edx], ${fmtReg("b", rawtype(ptr))}`
    )
}

function MEVAL(ampar, ...par) {
    var OUT = math2RPN(par.slice(0, ampar).join(" "))
    console.log(OUT)
    add_text(
        `xor %eax, %eax`)
    //     `${moveInto("a", rawtype(par[0]), par[0])}`,
    //     `${moveInto("b", rawtype(par[1]), par[1])}`,
    // )

    var ASMmathOP = (operator) => {
        switch (operator) {
            case '+':
                return "add";
            case '-':
                return "sub";
            case '*':
                return "mul";
            case '/':
                return "div";
            case '<':
                return "shl";
            case '>':
                return "shr";
        }
    }

    var stack = []
    for (var i = 0; i < numpar; i++) {
        var current = OUT[i]
        console.log(current, "0000000", typeof current)
        if(Object.keys(precedence).includes(current)) {
            var op = ASMmathOP(current)
            add_text(`pop %ebx`,`pop %eax`)
            if(op == "mul" || op == "div")
            {
                add_text(`${op} %ebx`)
            }
            else 
            {
                add_text(`${op} %eax, %ebx`)
            }
            add_text(`push %eax`)
        }
        else{
            add_text(
                `xor %ebx, %ebx`,
                `${moveInto("b", rawtype(current), current)}`,
                `push %ebx`
            )
        } 
    }
    //add_text("pop %ecx");
    return "%ecx"
}