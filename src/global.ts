// @ts-expect-error There is no type definition for this package
import { TextEncoder, TextDecoder } from 'text-decoding';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
