import 'source-map-support/register';
import { Command, Options } from 'clime';
export declare class GreetingOptions extends Options {
    lang: string;
}
export default class extends Command {
    execute(name: string, options: GreetingOptions): string;
}
