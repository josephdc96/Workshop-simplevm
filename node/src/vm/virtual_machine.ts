export enum Bytecode {
    NOP,
    DUMP,
    TRACE,
    PRINT,
    HALT,
    FATAL,

    // Stack opcodes
    CONST,
    POP,

    // Math opcodes (binary)
    ADD,
    SUB,
    MUL,
    DIV,
    MOD,

    // Math opcodes (unary)
    ABS,
    NEG,

    // Comparison
    EQ,
    NEQ,
    GT,
    LT,
    GTE,
    LTE,

    // Branching opcodes
    JMP,
    JMPI,
    RJMP,
    RJMPI,
    JZ,
    JNZ,

    // Globals
    GSTORE,
    GLOAD,

    // Procedures/locals
    CALL,
    RET,
    LOAD,
    STORE
}

export class VirtualMachine {
    trace = false;

    private Trace(message: string) {
        if (this.trace)
            console.log(`TRACE: ${message}`);
    }

    private Dump() {
        console.log('SimpleVM - DUMP');
        console.log('===============');
    }

    public Execute1(opcode: Bytecode, operands: number) {

    }

    public Execute2(code: Bytecode[]) {

    }
}