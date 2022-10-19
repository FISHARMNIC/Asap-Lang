/*

Simple memory allocation and freeing

Methodology
malloc allocated a specified size + 1, where the first byte is the length of the allocated array
free spots are noted by 0

*/

.intel_syntax

.section .data
dymem: .fill 100, 1, 0
.section .text

// expects: (ecx: size)
// returns: (ecx: pointer)
malloc:
    _shift_stack_right_
    pop %ecx
    lea %eax, dymem
    malloc.lp:
        cmpb [%eax], 0 # if the pointer is zero
        je malloc.check_freespot
        xor %ebx, %ebx
        movb %bl, [%eax] # load jump coordinate
        add %eax, %ebx
        jmp malloc.lp

    malloc.freespot_falsepositive:
        inc %eax
        jmp malloc.lp
    
    malloc.check_freespot:
        mov %ebx, %eax # save found address
        mov %edx, 0
        malloc.cf_lp:
            cmpb [%ebx], 0
            jne malloc.freespot_falsepositive # if the block isn't big enough, keep looking
            inc %ebx
            inc %edx
            cmp %edx, %ecx # free space with the desired size?
            jge malloc.found_freespot # found a spot big enough
            jmp malloc.cf_lp
    malloc.found_freespot:
        movb [%eax], %cl # declare size
        mov %ecx, %eax # load address
        inc %ecx # return adress
        mov %eax, %ecx
    
    _shift_stack_left_
    ret
    
// expects: (ecx: pointer)
free:
    _shift_stack_right_
    pop %ecx

    dec %ecx # data pointer - 1 = size
    mov %edi, %ecx # set write address to pointer

    xor %ebx, %ebx
    mov %bl, [%ecx] # read size pointed at by provided address
    
    mov %ecx, %ebx # prepare size
    inc %ecx # data + size byte

    mov %eax, 0 # writing zeros
    rep stosb
    
    _shift_stack_left_
    ret

.macro malloc_m size
    push \size  
    _shift_stack_left_
    call malloc
    _shift_stack_right_
.endm

.macro free_m pointer
    push \pointer
    _shift_stack_left_
    call free
    _shift_stack_right_
.endm
