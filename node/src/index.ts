#!/usr/bin/env node
import { open, read } from 'fs';

if (process.argv.length < 1) {
    console.error('A program is required');
    process.exit();
}

const bytes = open(process.argv[0], 'r', (status, fd) => {
    let buffer = Buffer.allo
});