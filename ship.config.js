module.exports = {
  publishCommand: ({ defaultCommand, tag }) =>
	`${defaultCommand} --access public --tag ${tag}`,
  getTagName: ({ version }) => `nandenjin/v${version}`
};
