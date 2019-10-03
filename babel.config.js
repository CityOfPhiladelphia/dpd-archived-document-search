module.exports = {
  presets: [
    [ '@vue/app', {
      targets: {
        ie: "11",
      },
      useBuiltIns: 'entry',
    }],
  ],
};