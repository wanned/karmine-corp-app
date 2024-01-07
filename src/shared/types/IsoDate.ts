type Year = `${number}${number}${number}${number}`;
type Month = `${number}${number}`;
type Day = `${number}${number}`;
type Hour = `${number}${number}`;
type Minute = `${number}${number}`;
type Second = `${number}${number}`;
type Millisecond = `${number}${number}${number}`;

export type IsoDate = `${Year}-${Month}-${Day}T${Hour}:${Minute}:${Second}.${Millisecond}Z`;
