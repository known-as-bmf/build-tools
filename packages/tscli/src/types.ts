import {
  array,
  assert,
  enums,
  object,
  string,
  union,
  func,
  type,
  dynamic,
  Struct,
  intersection,
  record,
  any,
  defaulted,
  create,
  Infer,
} from 'superstruct';

import { identity } from './utils/function';

// eslint-disable-next-line @rushstack/typedef-var
const outputKind = enums(['cjs', 'es']);
export type OutputKind = Infer<typeof outputKind>;

// eslint-disable-next-line @rushstack/typedef-var
const outputDefinition = intersection([
  type({ format: outputKind }),
  record(string(), any()),
]);
export type OutputDefinition = Infer<typeof outputDefinition>;

// eslint-disable-next-line @rushstack/typedef-var
const format = dynamic<OutputKind | OutputDefinition>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (value, ctx): Struct<any> => {
    if (typeof value === 'string') {
      return outputKind;
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      return outputDefinition;
    } else {
      ctx.fail();
      return union([outputKind, outputDefinition]);
    }
  }
);

// eslint-disable-next-line @rushstack/typedef-var
const BuildConfigurationStruct = object({
  entry: union([string(), array(string())]),
  format: array(outputDefinition),
  output: string(),
  rollup: func(),
});

// eslint-disable-next-line @rushstack/typedef-var
const TscliConfigurationStruct = defaulted(
  object({
    build: defaulted(
      object({
        entry: defaulted(union([string(), array(string())]), 'src/index.ts'),
        format: defaulted(array(format), [
          { format: 'es', entryFileNames: '[name].[format].js' },
          { format: 'cjs', entryFileNames: '[name].[format].js' },
          {
            format: 'cjs',
            minify: true,
            entryFileNames: '[name].[format].min.js',
          },
        ]),
        output: defaulted(string(), 'dist'),
        rollup: defaulted(func(), () => identity),
      }),
      {}
    ),
    lint: defaulted(
      object({ input: defaulted(array(string()), ['src', 'test']) }),
      {}
    ),
  }),
  {}
);

export type BuildConfiguration = Infer<typeof BuildConfigurationStruct>;
export type TscliConfiguration = Infer<typeof TscliConfigurationStruct>;

export function checkBuildConfiguration(
  input: unknown
): asserts input is BuildConfiguration {
  //coerce(input, BuildConfigurationStruct);
  assert(input, BuildConfigurationStruct);
}

export function coerceTscliConfiguration(input: unknown): TscliConfiguration {
  return create(input, TscliConfigurationStruct);
}
