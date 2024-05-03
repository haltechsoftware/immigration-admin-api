export default (json: string): number => {
  return new Blob([json]).size;
};
