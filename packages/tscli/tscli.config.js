module.exports = {
  build: {
    entry: ['src/commands/*', 'src/index.ts'],
    format: [
      {
        format: 'cjs',
        entryFileNames: '[name].js',
        preserveModules: true,
        exports: 'named',
      },
    ],
  },
  lint: {
    input: ['src'],
  },
};
