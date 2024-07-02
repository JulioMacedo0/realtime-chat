export const getFileExtension = (uri: string) => {
  const match = /\.([a-zA-Z]+)$/.exec(uri);

  if (match == null) throw new Error(`Erro for get File extension from ${uri}`);

  return match[1];
};
