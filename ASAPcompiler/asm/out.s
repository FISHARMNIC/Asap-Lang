.intel_syntax
.org 0x100
.global _kernel_entry
.section .data
.include "../../ASAPasmlibs/framework/stackHandler.s"
.include "../../ASAPasmlibs/framework/malloc.s"
.include "../../ASAPasmlibs/framework/strings.s"
.include "../../ASAPasmlibs/framework/langUtils.s"
.include "../../ASAPasmlibs/stdio.s"
_cast_ptrnum_: .4byte 0
_cast_8num_: .byte 0
_cast_16num_: .2byte 0
_cast_32num_: .4byte 0
_return_int_: .4byte 0
_return_char_: .byte 0
__ALLOC_0__: .asciz "Enter your name: "
name: .4byte 0
__ALLOC_1__: .asciz "Welcome "

.section .text
_kernel_entry:
mov %eax, %esp
sub %eax, FRAME_OFFSET
mov _stack_d2_, %eax
_shift_stack_left_
call main
_shift_stack_right_
hlt
main:
_shift_stack_right_
xor %ebx, %ebx
lea %ebx, __ALLOC_0__
push %ebx
_shift_stack_left_
call put_string
_shift_stack_right_
_shift_stack_left_
call gets
_shift_stack_right_
mov %ebx, %ecx
mov name, %ebx
xor %ebx, %ebx
lea %ebx, __ALLOC_1__
push %ebx
xor %ebx, %ebx
mov %ebx, name
push %ebx
_shift_stack_left_
call strconcat
_shift_stack_right_
xor %ebx, %ebx
mov %ebx, %ecx
push %ebx
_shift_stack_left_
call put_string
_shift_stack_right_
xor %ecx, %ecx
mov %ebx, 0
push %ecx
_shift_stack_left_
ret

