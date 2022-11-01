.section .data
eex: .long 0
efx: .long 0

.globl eex
.globl efx

.comm _strconcat_o_buff_ 100, 1
/*

Functions crucial to the Asap language

*/

.section .text

# easy concatenation into a new buffer
# somehow broken
strconcat:
    _shift_stack_right_
    pop %eax # buffer 2
    pop %ebx # buffer 1

    lea %ecx, _strconcat_o_buff_

    strconcat_loop1:
    mov %dl, [%eax] # copy byte
    mov [%ecx], %dl
    inc %eax
    inc %ecx
    cmpb [%eax], 0
    jne strconcat_loop1

    // # ------------

    // movb [%ecx], 0
    // lea %ecx, _strconcat_o_buff_
    // _shift_stack_left_
    // ret
    
    // # ------------
    inc %ecx

    strconcat_loop2:
    mov %dl, [%ebx] # copy byte
    mov [%ecx], %dl
    inc %ebx
    inc %ecx
    cmpb [%ebx], 0
    jne strconcat_loop2

   // movb [%ecx], 0
    lea %ecx, _strconcat_o_buff_

    _shift_stack_left_
    ret

.macro strconcat_m str1 str2
    push \str1
    push \str2
    _shift_stack_left_
    call strconcat
    _shift_stack_right_
.endm
