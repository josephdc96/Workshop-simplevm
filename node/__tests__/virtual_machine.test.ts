import {Bytecode, VirtualMachine} from "../src/vm/virtual_machine";

describe('Virtual Machine', () => {
    describe('Call Tests', () => {
        test('Countdown', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.NOP,
                Bytecode.JMP, 25,
                Bytecode.STORE, 0,
                Bytecode.LOAD, 0,
                Bytecode.PRINT,
                Bytecode.LOAD, 0,
                Bytecode.CONST, 0,
                Bytecode.EQ,
                Bytecode.JNZ, 24,
                Bytecode.LOAD, 0,
                Bytecode.CONST, 1,
                Bytecode.SUB,
                Bytecode.STORE, 0,
                Bytecode.JMP, 5,
                Bytecode.RET,
                // end
                Bytecode.CONST, 5,
                Bytecode.CALL, 3,
                Bytecode.NOP,
            ]);

            expect(0).toBe(vm.Stack.length);
        })
    })

    describe('Comparison Tests', () => {
        test('Test EQ', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.EQ
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(0).toEqual(vm.Stack[0]);
        })
        test('Text NEQ', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.NEQ
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(1).toEqual(vm.Stack[0]);
        })
        test('Text GT', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.GT
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(0).toEqual(vm.Stack[0]);
        })
        test('Text LT', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.LT
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(1).toEqual(vm.Stack[0]);
        })
        test('Text GTE', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.GTE
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(0).toEqual(vm.Stack[0]);
        })
        test('Text LTE', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.LTE
            ]);

            expect(1).toEqual(vm.Stack.length);
            expect(1).toEqual(vm.Stack[0]);
        })
    })

    describe('Globals Tests', () => {
        test('Global Load', () => {
            const vm = new VirtualMachine();
            vm.Globals[0] = 27;
            vm.Execute2([
                Bytecode.GLOAD, 0
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(27);
        });

        test('Global Store', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 27,
                Bytecode.GSTORE, 0,
            ]);

            expect(vm.Stack.length).toEqual(0);
            expect(vm.Globals[0]).toEqual(27);
        });

        test('Globals', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 27,
                Bytecode.GSTORE, 0,
                Bytecode.GLOAD, 0,
                Bytecode.GLOAD, 0,
                Bytecode.ADD,
                Bytecode.GSTORE, 1
            ]);

            expect(vm.Stack.length).toEqual(0);
            expect(vm.Globals[0]).toEqual(27);
            expect(vm.Globals[1]).toEqual(27 + 27);
        })
    })

    describe('Jump Tests', () => {
        test('Test JMP', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                /* 0*/ Bytecode.JMP, 6,
                /* 2*/ Bytecode.CONST, 12,
                /* 4*/ Bytecode.FATAL,
                /* 5*/ Bytecode.FATAL,
                /* 6*/ Bytecode.NOP,
            ]);

            expect(vm.Stack.length).toEqual(0);
        });

        test('Test RJMP', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                /* 0*/ Bytecode.RJMP, 6,
                /* 2*/ Bytecode.CONST, 12,
                /* 4*/ Bytecode.FATAL,
                /* 5*/ Bytecode.FATAL,
                /* 6*/ Bytecode.NOP,
            ]);

            expect(vm.Stack.length).toEqual(0);
        })

        test('Test JMP', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 7,
                Bytecode.JMPI,
                Bytecode.CONST, 12,
                Bytecode.CONST, 27,
                Bytecode.NOP,
            ]);

            expect(vm.Stack.length).toEqual(0);
        })

        test('Test JMP', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 5,
                Bytecode.RJMPI,
                Bytecode.CONST, 12,
                Bytecode.FATAL,
                Bytecode.FATAL,
                Bytecode.NOP,
            ]);

            expect(vm.Stack.length).toEqual(0);
        })

        test('Test Lots of Jumps', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                /* 0*/ Bytecode.TRACE,
                /* 1*/ Bytecode.JMP, 4,  // bypass FATAL opcode
                /* 3*/ Bytecode.FATAL,
                /* 4*/ Bytecode.JMP, 7,
                /* 6*/ Bytecode.FATAL,
                /* 7*/ Bytecode.JMP, 10,
                /* 9*/ Bytecode.FATAL,
                /*10*/ Bytecode.NOP
            ]);

            expect(vm.Stack.length).toEqual(0);
        })
    })

    describe('Math Tests', () => {
        test('Test Add', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 5,
                Bytecode.CONST, 5,
                Bytecode.ADD,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        });

        test('Test Sigma Add', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 15,
                Bytecode.CONST, 5,
                Bytecode.CONST, 2,
                Bytecode.CONST, 6,
                Bytecode.CONST, 4,
                Bytecode.SIGADD,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(28);
        })

        test('Test Mod', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 30,
                Bytecode.CONST, 20,
                Bytecode.MOD,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        });

        test('Test Sub', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 15,
                Bytecode.CONST, 5,
                Bytecode.SUB,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        })

        test('Test Mul', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 5,
                Bytecode.CONST, 2,
                Bytecode.MUL,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        });

        test('Test Sigma Mul', () => {
            const vm = new VirtualMachine();
            vm.Execute2([
                Bytecode.CONST, 15,
                Bytecode.CONST, 5,
                Bytecode.CONST, 2,
                Bytecode.CONST, 6,
                Bytecode.CONST, 4,
                Bytecode.SIGMUL,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(900);
        });

        test('Test Div', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, 20,
                Bytecode.CONST, 2,
                Bytecode.DIV,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        });

        test('Test Abs', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, -30,
                Bytecode.ABS,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(30);
        });

        test('Test Neg', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, -10,
                Bytecode.NEG,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(10);
        });

        test('Test NegNeg', () => {
            const vm = new VirtualMachine();

            vm.Execute2([
                Bytecode.CONST, -10,
                Bytecode.NEG,
                Bytecode.NEG,
            ]);

            expect(vm.Stack.length).toEqual(1);
            expect(vm.Stack[0]).toEqual(-10);
        });
    });
})