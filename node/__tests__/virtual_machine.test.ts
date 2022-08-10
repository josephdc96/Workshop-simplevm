import { Bytecode, VirtualMachine } from "../src/vm/virtual_machine";

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
})