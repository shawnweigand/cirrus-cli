#!/usr/bin/env node

import chalk from 'chalk';
import boxen from 'boxen';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import cirrusView from '../utils/view.js';

const argv = hideBin(process.argv);

const y = yargs(hideBin(process.argv))
    .usage('$0 <command> [options]')
    .command(
        'init',
        'Initialize Terraform form schema',
        (yargs) => {
            return yargs.option('from', {
                alias: 'f',
                type: 'string',
                describe: 'Comma-separated list of Terraform variables file paths to initialize form schema from.',
                default: '.',
                demandOption: false,
            })
            .usage('Usage: $0 init --from <paths>');
        },
        (argv) => {
            console.log(`Initializing cirrus project from: ${argv.from}`);
            // Your init logic here
        }
    )
    .command(
        'view',
        'View Terraform form schema',
        (yargs) => {
            return yargs.option('from', {
                alias: 'f',
                type: 'string',
                describe: 'Comma-separated list of schema file paths to view the generated form from.',
                default: './.cirrus',
                demandOption: false,
            })
            .usage('Usage: $0 view --from <paths>');
        },
        (argv) => cirrusView(argv)
    )
    .demandCommand(1, 'You need at least one command before moving on')
    .help()
    .alias('help', 'h')
    .alias('version', 'v')

if (argv.length === 0) {
    figlet('cirrus', (err, data) => {
        if (err) {
            console.error('Figlet error:', err);
            process.exit(1);
        }

        const description = 'Your Terraform forms. Declarative, flexible, deploy-ready.';
        const content = `${data}\n\n${description}`;

        const box = gradient.pastel.multiline(boxen(content, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            align: 'center',
        }));

        console.log(box);
        y.showHelp();
        process.exit(0);
    })
} else {
    y.parse()
}