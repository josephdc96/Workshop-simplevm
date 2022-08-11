import { exit } from "process";

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
    DUP,

    // Math opcodes (binary)
    ADD,
    SUB,
    MUL,
    DIV,
    MOD,

    // Math opcodes (unary)
    ABS,
    NEG,
    
    // Math opcodes (sigma)
    SIGADD,
    SIGMUL,

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

export class CallFrame
{
    locals: number[] = new Array(32);
    returnAddress: number = -1;
}

export class VirtualMachine {
    // Stack
    //
    stack: number[] = new Array(100);
    SP: number = -1;
    IP: number = -1;
    get Stack(): number[] {
        if (this.SP === -1) {
            return [];
        }
        return this.stack.slice(0, this.SP + 1);
    }

    public Push(operand: number) {
        this.Trace(`Push: ${operand}`);
        this.stack[this.SP + 1] = operand;
        this.SP++;
        this.Trace(` --> Stack: ${this.stack}`);
    }

    public Pop(): number {
        this.Trace("Pop");
        const result = this.stack[this.SP];
        this.SP--;
        this.Trace(` -->  Stack: ${this.stack}`);
        return result;
    }

    // Tracing
    //
    trace = false;
    private Trace(message: string) {
        if (this.trace)
            console.log(`TRACE: ${message}`);
    }

    // Globals
    public Globals: number[] = new Array(32);

    // Frames
    public Frames: CallFrame[] = [];
    get FP(): CallFrame {
        return this.Frames[this.Frames.length - 1];
    }

    // Diagnostics
    private Dump() {
        console.log('SimpleVM - DUMP');
        console.log('===============');

        console.log(`IP: ${this.IP} / Trace: ${this.trace}`);
        console.log(`Working stack (SP ${this.SP}): ${this.Stack}`);
        console.log(`Globals: ${this.Globals}`);
        console.log('Call Stack: ');
        this.Frames.forEach((frame, i) => {
            console.log(` Call Frame ${i}`);
            console.log(` +- ReturnAddr: ${frame.returnAddress}`);
            console.log(` +- Locals: ${frame.locals}`);
        })
    }

    public Execute1(opcode: Bytecode, operands: number[]) {
        switch (opcode) {
            case Bytecode.NOP:
                break;
            case Bytecode.DUMP:
                this.Dump();
                break;
            case Bytecode.TRACE:
                this.trace = !this.trace;
                break;
            case Bytecode.HALT:
                exit();
                break;
            case Bytecode.FATAL:
                throw new Error(`Fatal Error`);
                break;
            case Bytecode.CONST:
                this.Push(operands[0]);
                break;
            case Bytecode.POP:
                this.Pop();
                break;
            case Bytecode.PRINT:
                const print_val = this.Pop();
                console.log(print_val);
                break;
            case Bytecode.DUP:
                const dup_val = this.Pop();
                this.Push(dup_val);
                this.Push(dup_val);
                break;
            case Bytecode.ADD:
                const add_b = this.Pop();
                const add_a = this.Pop();
                const sum = add_a + add_b;
                this.Push(sum);
                break;
            case Bytecode.SUB:
                const sub_b = this.Pop();
                const sub_a = this.Pop();
                const diff = sub_a - sub_b;
                this.Push(diff);
                break;
            case Bytecode.MUL:
                const mul_b = this.Pop();
                const mul_a = this.Pop();
                const prod = mul_a * mul_b;
                this.Push(prod);
                break;
            case Bytecode.DIV:
                const div_b = this.Pop();
                const div_a = this.Pop();
                const div = div_a / div_b;
                this.Push(div);
                break;
            case Bytecode.MOD:
                const mod_b = this.Pop();
                const mod_a = this.Pop();
                const mod = mod_a % mod_b;
                this.Push(mod);
                break;
            case Bytecode.ABS:
                const abs_a = this.Pop();
                const abs = Math.abs(abs_a);
                this.Push(abs);
                break;
            case Bytecode.NEG:
                const neg_a = this.Pop();
                const neg = neg_a * -1;
                this.Push(neg);
                break;
            case Bytecode.SIGADD:
                const sigadd = this.Pop();
                let sigsum = 0;
                for (let i = 0; i < sigadd; i++) {
                    sigsum += this.Pop();
                }
                this.Push(sigsum);
                break;
            case Bytecode.SIGMUL:
                const sigmul = this.Pop();
                let sigprod = 1;
                for (let i = 0; i < sigmul; i++) {
                    sigprod *= this.Pop();
                }
                this.Push(sigprod);
                break;
            case Bytecode.EQ:
                const eq_b = this.Pop();
                const eq_a = this.Pop();
                const eq = eq_a === eq_b;
                this.Push(eq ? 1 : 0);
                break;
            case Bytecode.NEQ:
                const neq_b = this.Pop();
                const neq_a = this.Pop();
                const neq = neq_a !== neq_b;
                this.Push(neq ? 1 : 0);
                break;
            case Bytecode.GT:
                const gt_b = this.Pop();
                const gt_a = this.Pop();
                const gt = gt_a > gt_b;
                this.Push(gt ? 1 : 0);
                break;
            case Bytecode.LT:
                const lt_b = this.Pop();
                const lt_a = this.Pop();
                const lt = lt_a < lt_b;
                this.Push(lt ? 1 : 0);
                break;
            case Bytecode.GTE:
                const gte_b = this.Pop();
                const gte_a = this.Pop();
                const gte = gte_a >= gte_b;
                this.Push(gte ? 1 : 0);
                break;
            case Bytecode.LTE:
                const lte_b = this.Pop();
                const lte_a = this.Pop();
                const lte = lte_a <= lte_b;
                this.Push(lte ? 1 : 0);
                break;
            case Bytecode.JMP:
                const jmp = operands[0];
                this.IP = jmp - 1;
                break;
            case Bytecode.JMPI:
                const jmpi = this.Pop();
                this.IP = jmpi - 1;
                break;
            case Bytecode.RJMP:
                const rjmp = operands[0];
                this.IP = this.IP + rjmp - 1;
                break
            case Bytecode.RJMPI:
                const rjmpi = this.Pop();
                this.IP = this.IP + rjmpi - 1;
                break;
            case Bytecode.JZ:
                var jz_top = this.Pop();
                var jz_code = operands[0];
                if (jz_top === 0) {
                    this.IP = jz_code - 1;
                }
                break;
            case Bytecode.JNZ:
                var jnz_top = this.Pop();
                var jnz_code = operands[0];
                if (jnz_top !== 0) {
                    this.IP = jnz_code - 1;
                }
                break;
            case Bytecode.GLOAD:
                var gload_index = operands[0];
                var gload_value = this.Globals[gload_index];
                this.Push(gload_value);
                break;
            case Bytecode.GSTORE:
                var gstore_top = this.Pop();
                var gstore_index = operands[0];
                this.Globals[gstore_index] = gstore_top;
                break;
            case Bytecode.CALL:
                const return_index = operands[0];
                const call_frame = new CallFrame();
                call_frame.returnAddress = this.IP + 2;
                this.Frames.push(call_frame);
                this.IP = return_index - 1;
                break;
            case Bytecode.RET:
                const ret_frame = this.FP;
                this.IP = ret_frame.returnAddress - 1;
                this.Frames.pop();
                break;
            case Bytecode.STORE:
                const store_top = this.Pop();
                const store_index = operands[0];
                this.FP.locals[store_index] = store_top;
                break;
            case Bytecode.LOAD:
                const load_index = operands[0];
                const load_value = this.FP.locals[load_index];
                this.Push(load_value);
                break;
            default:
                throw new Error('Unknown Opcode');
                exit();
                break;
        }
    }

    public Execute2(code: Bytecode[]) {
        for (this.IP = 0; this.IP < code.length;) {
            var opcode = code[this.IP];
            switch (opcode)
            {
                case Bytecode.NOP:
                case Bytecode.DUMP:
                case Bytecode.TRACE:
                case Bytecode.PRINT:
                case Bytecode.FATAL:
                case Bytecode.POP:
                case Bytecode.DUP:
                case Bytecode.SUB:
                case Bytecode.ADD: 
                case Bytecode.MUL: 
                case Bytecode.DIV:
                case Bytecode.MOD:
                case Bytecode.ABS:
                case Bytecode.NEG:
                case Bytecode.SIGADD: 
                case Bytecode.SIGMUL:
                case Bytecode.EQ: 
                case Bytecode.NEQ:
                case Bytecode.GT:
                case Bytecode.LT:
                case Bytecode.GTE:
                case Bytecode.LTE:
                case Bytecode.JMPI:
                case Bytecode.RJMPI:
                    this.Execute1(opcode, []);
                    break;
                
                case Bytecode.CONST:
                case Bytecode.JMP:
                case Bytecode.RJMP:
                case Bytecode.JZ: 
                case Bytecode.JNZ:
                case Bytecode.GLOAD: 
                case Bytecode.GSTORE:
                case Bytecode.CALL:
                case Bytecode.RET:
                case Bytecode.LOAD:
                case Bytecode.STORE:
                    const operand = (code[this.IP + 1] as number);
                    this.IP++;
                    this.Execute1(opcode, [operand]);
                    break;

                case Bytecode.HALT:
                    return;

                default:
                    throw new Error(`Unrecognized opcode: ${code[this.IP]}`);
            }
            this.IP++;
        }
    }
}