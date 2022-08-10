namespace vm;

public enum Bytecode 
{
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

public class CallFrame
{
    public int[] locals;
    public int returnAddress;

    public CallFrame()
    {
        locals = new int[32];
    }
}

public class VirtualMachine
{
    // Stack
    //
    public int[] stack = new int[100];
    public int SP = -1;
    public int[] Stack
    {
        get
        {
            if (SP == -1) 
                return Array.Empty<int>();
            return stack.Take(SP + 1).ToArray();
        }
    }

    public void Push(int operand)
    {
        Trace($"Push: {operand}");
        stack[++SP] = operand;
        Trace(" -->  Stack: " + string.Join(",", stack));
    }

    public int Pop()
    {
        Trace("Pop");
        var result = stack[SP--];
        Trace(" -->  Stack: " + String.Join(",", stack));
        return result;
    }

    // Tracing
    //
    bool trace = false;
    private void Trace(string message)
    {
        if (trace)
            Console.WriteLine("TRACE: {0}", message);
    }
    
    // Globals
    public int[] Globals = new int[32];
    
    // Frames
    public List<CallFrame> Frames = new List<CallFrame>();

    public CallFrame FP()
    {
        return Frames[Frames.Count - 1];
    }

    // Diagnostics
    //
    private void Dump()
    {
        Console.WriteLine("SimpleVM - DUMP");
        Console.WriteLine("===============");
        // Uncomment when you implement Execute(Bytecode[])
        
        Console.WriteLine("IP: {0} / Trace: {1}", IP, trace);
        Console.WriteLine("Working stack (SP {0}): {1}", SP, String.Join(", ", Stack));
        Console.WriteLine("Globals: {0}", Globals);
        //Console.WriteLine("Call stack: ");
        /*for (int f = Frames.Count - 1; f > -1; f--) {
            CallFrame cf = Frames[f];
            Console.WriteLine("  Call Frame {0}:", f);
            Console.WriteLine("  +- ReturnAddr: {0}", cf.ReturnAddress);
            Console.WriteLine("  +- Locals: {0}", cf.Locals);
        }*/
    }

    public void Execute(Bytecode opcode, params int[] operands)
    {
        switch (opcode)
        {
            case Bytecode.NOP:
                Trace("NOP");
                break;
            case Bytecode.DUMP:
                Trace("DUMP");
                Dump();
                break;
            case Bytecode.TRACE:
                var status = trace ? "off" : "on";
                Trace($"TRACE turned {status}");
                this.trace = !this.trace;
                break;
            case Bytecode.HALT:
                Trace("HALT");
                System.Environment.Exit(0);
                break;
            case Bytecode.FATAL:
                Trace($"FATAL: {operands[0]}");
                throw new Exception($"Fatal Error #{operands[0]}");
                break;
            case Bytecode.CONST:
                Trace("CONST");
                Push(operands[0]);
                break;
            case Bytecode.POP:
                Trace("POP");
                Pop();
                break;
            case Bytecode.PRINT:
                Trace("PRINT");
                Print();
                break;
            case Bytecode.DUP:
                Trace("DUP");
                var value = Pop();
                Push(value);
                Push(value);
                break;
            case Bytecode.ADD:
                var add_b = Pop();
                var add_a = Pop();
                Trace($"ADD {add_a} + {add_b}");
                var sum = add_a + add_b;
                Trace($"SUM {sum}");
                Push(sum);
                break;
            case Bytecode.SUB:
                var sub_b = Pop();
                var sub_a = Pop();
                Trace($"SUB {sub_a} - {sub_b}");
                var diff = sub_a - sub_b;
                Trace($"DIFFERENCE {diff}");
                Push(diff);
                break;
            case Bytecode.MUL:
                var mul_b = Pop();
                var mul_a = Pop();
                Trace($"MUL {mul_a} - {mul_b}");
                var prod = mul_a * mul_b;
                Trace($"PRODUCT {prod}");
                Push(prod);
                break;
            case Bytecode.DIV:
                var div_b = Pop();
                var div_a = Pop();
                Trace($"DIV {div_a} / {div_b}");
                var div = div_a / div_b;
                Trace($"DIVIDEND {div}");
                Push(div);
                break;
            case Bytecode.MOD:
                var mod_b = Pop();
                var mod_a = Pop();
                Trace($"MOD {mod_a} % {mod_b}");
                var mod = mod_a % mod_b;
                Trace($"MODULUS {mod}");
                Push(mod);
                break;
            case Bytecode.ABS:
                var abs_a = Pop();
                Trace($"ABS {abs_a}");
                var abs = Math.Abs(abs_a);
                Trace($"VALUE {abs}");
                Push(abs);
                break;
            case Bytecode.NEG:
                var neg_a = Pop();
                Trace($"NEG {neg_a}");
                var neg = neg_a * -1;
                Trace($"VALUE {neg}");
                Push(neg);
                break;
            case Bytecode.SIGADD:
                var sigadd = Pop();
                Trace($"SIGSUM next {sigadd} values");
                var sigsum = 0;
                for (int i = 0; i < sigadd; i++) sigsum += Pop();
                Trace($"SUM {sigsum}");
                Push(sigsum);
                break;
            case Bytecode.SIGMUL:
                var sigmul = Pop();
                Trace($"SIGSUM next {sigmul} values");
                var sigprod = 1;
                for (int i = 0; i < sigmul; i++) sigprod *= Pop();
                Trace($"PRODUCT {sigprod}");
                Push(sigprod);
                break;
            case Bytecode.EQ:
                var eq_b = Pop();
                var eq_a = Pop();
                Trace($"EQ is {eq_a} == {eq_b}?");
                var eq = eq_a == eq_b;
                Trace($"EQUALITY: {eq}");
                Push(eq ? 1 : 0);
                break;
            case Bytecode.NEQ:
                var neq_b = Pop();
                var neq_a = Pop();
                Trace($"NEQ is {neq_a} != {neq_b}?");
                var neq = neq_a != neq_b;
                Trace($"NEQUALITY: {neq}");
                Push(neq ? 1 : 0);
                break;
            case Bytecode.GT:
                var gt_b = Pop();
                var gt_a = Pop();
                Trace($"GT is {gt_a} > {gt_b}?");
                var gt = gt_a > gt_b;
                Trace($"GT: {gt}");
                Push(gt ? 1 : 0);
                break;
            case Bytecode.LT:
                var lt_b = Pop();
                var lt_a = Pop();
                Trace($"GT is {lt_a} <= {lt_b}?");
                var lt = lt_a < lt_b;
                Trace($"GT: {lt}");
                Push(lt ? 1 : 0);
                break;
            case Bytecode.GTE:
                var gte_b = Pop();
                var gte_a = Pop();
                Trace($"GT is {gte_a} > {gte_b}?");
                var gte = gte_a >= gte_b;
                Trace($"GT: {gte}");
                Push(gte ? 1 : 0);
                break;
            case Bytecode.LTE:
                var lte_b = Pop();
                var lte_a = Pop();
                Trace($"GT is {lte_a} > {lte_b}?");
                var lte = lte_a <= lte_b;
                Trace($"GT: {lte}");
                Push(lte ? 1 : 0);
                break;
            case Bytecode.JMP:
                var jmp = operands[0];
                Trace($"JMP to code[{jmp}]");
                IP = jmp - 1;
                break;
            case Bytecode.JMPI:
                var jmpi = Pop();
                Trace($"JMP to code[{jmpi}]");
                IP = jmpi - 1;
                break;
            case Bytecode.RJMP:
                var rjmp = operands[0];
                Trace($"RJMP to code[{IP + rjmp}]");
                IP = IP + rjmp - 1;
                break;
            case Bytecode.RJMPI:
                var rjmpi = Pop();
                Trace($"RJMP to code[{IP + rjmpi}]");
                IP = IP + rjmpi - 1;
                break;
            case Bytecode.JZ:
                var jz_top = Pop();
                var jz_code = operands[0];
                Trace($"JZ to code[{jz_code}");
                if (jz_top == 0)
                    IP = jz_code - 1;
                break;
            case Bytecode.JNZ:
                var jnz_top = Pop();
                var jnz_code = operands[0];
                Trace($"JZ to code[{jnz_code}");
                if (jnz_top != 0)
                    IP = jnz_code - 1;
                break;
            case Bytecode.GSTORE:
                var gstore_top = Pop();
                var gstore_index = operands[0];
                Trace($"GSTORE to index globals[{gstore_index}] value {gstore_top}");
                Globals[gstore_index] = gstore_top;
                break;
            case Bytecode.GLOAD:
                var gload_index = operands[0];
                Trace($"GLOAD from index globals[{gload_index}]");
                var gload_value = Globals[gload_index];
                Push(gload_value);
                break;
            case Bytecode.CALL:
                var return_index = operands[0];
                var call_frame = new CallFrame();
                call_frame.returnAddress = IP + 2;
                Frames.Add(call_frame);
                IP = return_index - 1;
                break;
            case Bytecode.RET:
                var ret_frame = FP();
                IP = ret_frame.returnAddress - 1;
                Frames.Remove(ret_frame);
                break;
            case Bytecode.STORE:
                var store_top = Pop();
                var store_index = operands[0];
                Trace($"STORE to index fp[{store_index}] value {store_top}");
                FP().locals[store_index] = store_top;
                break;
            case Bytecode.LOAD:
                var load_index = operands[0];
                Trace($"GLOAD from index globals[{load_index}]");
                var load_value = FP().locals[load_index];
                Push(load_value);
                break;
            default:
                Trace($"Unknown Opcode: {opcode}");
                System.Environment.Exit(99);
                break;
        }
    }

    private int IP = -1;
    public void Execute(Bytecode[] code)
    {
        for (IP = 0; IP < code.Length; )
        {
            var opcode = code[IP];
            switch (opcode)
            {
                // 0-operand opcodes
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
                    Execute(opcode);
                    break;

                // 1-operand opcodes
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
                    int operand = (int)code[++IP];
                    Execute(opcode, operand);
                    break;

                // 2-operand opcodes
                

                // Special handling to bail out early
                case Bytecode.HALT:
                    return;

                // Unrecognized opcode
                default:
                    throw new Exception("Unrecognized opcode: " + code[IP]);
            }
            IP++;
        }
    }

    public void Print()
    {
        var value = Pop();
        Console.WriteLine(value);
    }
}
