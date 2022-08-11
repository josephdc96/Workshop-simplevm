// See https://aka.ms/new-console-template for more information

using vm;

namespace app;

public class Program
{
    public static void Main(string[] args)
    {
        if (args.Length < 1)
        {
            Console.WriteLine("You must specify a program");
            return;
        }

        var bytes = System.IO.File.ReadAllBytes(args[0]);
        var codeList = new List<Bytecode>();
        for (int i = 0; i < bytes.Length; i += 4)
        {
            int word = BitConverter.ToInt32(bytes, i);
            codeList.Add((Bytecode)word);
        }

        var vm = new VirtualMachine();
        vm.Execute(codeList.ToArray());
    }
}