/*

String library

*/

strlen:
    pusha
    _shift_stack_right_
    pop %eax
    mov %ecx, %eax # ecx will hold base
    dec %eax
    strlen.l:
        inc %eax
        cmpb [%eax], 0
        jne strlen.l
    sub %eax, %ecx
    _shift_stack_left_
    popa
    ret

.macro strlen_m pointer
    push \pointer
    _shift_stack_left_
    call strlen
    _shift_stack_right_
.endm
