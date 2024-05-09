export default (input: string) =>
  input.toLowerCase().replace(/\s+/g, '-').replace(/--+/g, '-').trim();
