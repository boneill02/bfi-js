/**
 * A brainfuck interpreter in JavaScript
 *
 * Author: Ben O'Neill <ben@oneill.sh>
 *
 * Copyright (c) 2022-2025 Ben O'Neill <ben@oneill.sh>.
 * This work is released under the terms of the MIT License. See
 * LICENSE.
 */

let prog = [],
    tape = [],
    loops = [],
    input = [];
let tp = 0,
    ip = 0,
    inp = 0;
const TAPESIZE = 30000;

/**
 * Finds matching pairs of '[' and ']' instructions in the brainfuck program.
 * Iterates through the `prog` array, identifying matching pairs of '[' and ']' instructions,
 * and stores their indices in the `loops` array as [start, end] pairs.
 *
 * Assumes `prog` is an array of brainfuck instructions and `loops` is an array to store loop pairs.
 */
function buildLoops() {
    for (let i = 0; i < prog.length; i++) {
        if (prog[i] == "[") {
            loops.push([i, -1]);
        } else if (prog[i] == "]") {
            for (let j = loops.length - 1; j >= 0; j--) {
                if (loops[j][1] == -1) {
                    loops[j][1] = i;
                }
            }
        }
    }
}

/**
 * Evaluates a single brainfuck instruction and updates the tape, pointer, and instruction pointer accordingly.
 *
 * @param {string} ins - The Brainfuck instruction to evaluate. Supported instructions: '+', '-', '.', ',', '<', '>', '[', ']'.
 *
 * @global {number[]} tape - The memory tape used by the Brainfuck interpreter.
 * @global {number} tp - The current position of the tape pointer.
 * @global {number} ip - The current instruction pointer.
 * @global {Array.<[number, number]>} loops - Array of loop start and end instruction pointer pairs.
 * @global {function(number): void} putc - Function to output a character.
 * @global {function(): number} getc - Function to input a character.
 */
function eval(ins) {
    switch (ins) {
        case "+":
            tape[tp]++;
            break;
        case "-":
            tape[tp]--;
            break;
        case ".":
            console.log(tape[tp]);
            putc(tape[tp]);
            break;
        case ",":
            tape[tp] = getc();
            break;
        case "<":
            if (tp > 0) tp--;
            break;
        case ">":
            tp++;
            break;
        case "[":
            if (tape[tp] == 0) {
                for (let i = 0; i < loops.length; i++) {
                    loop = loops[i];
                    if (loop[0] == ip) {
                        ip = loop[1];
                    }
                }
            }
            break;
        case "]":
            if (tape[tp] > 0) {
                for (let i = 0; i < loops.length; i++) {
                    loop = loops[i];
                    if (loop[1] == ip) {
                        ip = loop[0];
                    }
                }
            }
            break;
    }

    if (tape[tp] < 0) {
        tape[tp] = 0; // Ensure tape values are non-negative
    }
    if (tp >= TAPESIZE) {
        console.error("Tape pointer out of bounds");
        tp = TAPESIZE - 1; // Prevent out-of-bounds access
    }
    if (tp < 0) {
        console.error("Tape pointer underflow");
        tp = 0; // Prevent underflow
    }
}

/**
 * Appends a character, represented by its character code, to the value of the HTML element with id "output".
 *
 * @param {number} c - The character code of the character to append.
 */
function putc(c) {
    document.getElementById("output").value += String.fromCharCode(c);
}

/**
 * Reads the next character code from the input string.
 * If the end of the input is reached, returns 0.
 *
 * @returns {number} The Unicode code point of the next character, or 0 if input is exhausted.
 */
function getc() {
    if (inp >= input.length) {
        return 0;
    }

    return input.charCodeAt(inp++);
}

/**
 * Executes the main logic of the Brainfuck interpreter.
 * Initializes the tape, input, and program, builds loop mappings,
 * and evaluates each instruction in the program.
 *
 * Assumes the existence of global variables and functions:
 * - TAPESIZE: Number of cells in the tape.
 * - buildLoops(): Function to process and map loop brackets.
 * - eval(): Function to execute a single Brainfuck instruction.
 *
 * Interacts with the DOM to get input, program, and set output.
 */
function run() {
    tp = 0;
    ip = 0;
    inp = 0;
    tape = [];
    loops = [];
    input = document.getElementById("input").value;
    prog = document.getElementById("program").value.split("");
    document.getElementById("output").value = "";

    /* Evaluate loops and initialize tape */
    buildLoops();
    for (let i = 0; i < TAPESIZE; i++) {
        tape.push(0);
    }

    /* Evaluate the program */
    while (ip < prog.length) {
        eval(prog[ip]);
        ip++;
    }
}
