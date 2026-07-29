import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.blue('ℹ ') + msg),
  success: (msg: string) => console.log(chalk.green('✔ ') + msg),
  warning: (msg: string) => console.log(chalk.yellow('⚠ ') + msg),
  error: (msg: string) => console.log(chalk.red('✖ ') + msg),
  header: (msg: string) => console.log(chalk.bold.cyan('\n' + msg)),
  step: (step: number, total: number, msg: string) =>
    console.log(chalk.gray(`[${step}/${total}]`) + ' ' + chalk.bold(msg)),
};
