// See https://aka.ms/new-console-template for more information

using vm;

namespace assembler;

using System.Linq;

public class Program
{
    public static void Main(string[] args)
    {
        var input = "";
        var output = "";
        var wordSize = 32;
        
        for (var i = 0; i < args.Length; i++)
        {
            if (args[i] == "-i")
            {
                input = args[i + 1];
            }

            if (args[i] == "-o")
            {
                output = args[i + 1];
            }

            if (args[i] == "-s")
            {
                wordSize = int.Parse(args[i + 1]);
            }
        }

        if (input == "" || output == "")
        {
            Console.WriteLine("An input file and an output file must be specified");
            return;
        }

        if (wordSize != 8 && wordSize != 16 && wordSize != 32 && wordSize != 64)
        {
            Console.WriteLine("Word size must be a power of 2 greater than or equal to 8");
            return;
        }

        Assemble(input, output, wordSize);
    }

    private static void Assemble(string input, string output, int wordSize)
    {
        var code = System.IO.File.ReadAllText(input);
        code = code.ReplaceLineEndings(" ");
        byte[] codeArray = wordSize switch
        {
            8 => Assemble8(code),
            16 => Assemble16(code),
            32 => Assemble32(code),
            64 => Assemble32(code),
            _ => throw new ArgumentException("Invalid word size")
        };
        System.IO.File.WriteAllBytes(output, codeArray);
    }

    private static byte[] Assemble8(string code)
    {
        return Array.Empty<byte>();
    }

    private static byte[] Assemble16(string code)
    {
        return Array.Empty<byte>();
    }

    private static byte[] Assemble32(string code)
    {
        var words = code.Split(' ');
        var bytes = new List<byte>();
        foreach (var word in words)
        {
            int b;
            try
            {
                b = int.Parse(word);
            }
            catch (FormatException)
            {
                b = (int)ConvertBytecode(word);
            }
            bytes.AddRange(BitConverter.GetBytes(b));
        }
        
        return bytes.ToArray();
    }

    private static byte[] Assemble64(string code)
    {
        return Array.Empty<byte>();
    }

    private static Bytecode ConvertBytecode(string code)
    {
        return code.ToUpper() switch
        {
            "NOP" => Bytecode.NOP,
            "DUMP" => Bytecode.DUMP,
            "TRACE" => Bytecode.TRACE,
            "PRINT" => Bytecode.PRINT,
            "HALT" => Bytecode.HALT,
            "FATAL" => Bytecode.FATAL,
            // Stack opcodes
            "CONST" => Bytecode.CONST,
            "POP" => Bytecode.POP,
            "DUP" => Bytecode.DUP,
            // Math opcodes (binary)
            "ADD" => Bytecode.ADD,
            "SUB" => Bytecode.SUB,
            "MUL" => Bytecode.MUL,
            "DIV" => Bytecode.DIV,
            "MOD" => Bytecode.MOD,
            // Math opcodes (unary)
            "ABS" => Bytecode.ABS,
            "NEG" => Bytecode.NEG,
            // Math opcodes (sigma)
            "SIGADD" => Bytecode.SIGADD,
            "SIDMUL" => Bytecode.SIGMUL,
            // Comparison
            "EQ" => Bytecode.EQ,
            "NEQ" => Bytecode.NEQ,
            "GT" => Bytecode.GT,
            "LT" => Bytecode.LT,
            "GTE" => Bytecode.GTE,
            "LTE" => Bytecode.LTE,
            // Branching opcodes
            "JMP" => Bytecode.JMP,
            "JMPI" => Bytecode.JMPI,
            "RJMP" => Bytecode.RJMP,
            "RJMPI" => Bytecode.RJMPI,
            "JZ" => Bytecode.JZ,
            "JNZ" => Bytecode.JNZ,
            // Globals
            "GSTORE" => Bytecode.GSTORE,
            "GLOAD" => Bytecode.GLOAD,
            // Procedures/locals
            "CALL" => Bytecode.CALL,
            "RET" => Bytecode.RET,
            "LOAD" => Bytecode.LOAD,
            "STORE" => Bytecode.STORE,
            _ => Bytecode.FATAL
        };
    }
}