/*

Initiates a double-frame stack which allows values to be pushed onto stack
without the interference of methods 

*/

.section .data
_stack_d1_: .long 0
_stack_d2_: .long 0

FRAME_OFFSET = 100
.macro _shift_stack_left_
    mov _stack_d1_, %esp # duplicate the current pos
    mov %esp, _stack_d2_ # switch to second stack frame
.endm

.macro _shift_stack_right_
    mov _stack_d2_, %esp # duplicate the current pos
    mov %esp, _stack_d1_ # go back to the original frame
.endm

.macro _stack_init_
    mov %eax, %esp
    sub %eax, FRAME_OFFSET
    mov _stack_d2_, %eax
.endm
