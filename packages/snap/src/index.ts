const lensLookup = async function (name: string) {
  const query = `query Profile { profile(request: { handle: "${name}" }) { ownedBy } }`;
  const result = await fetch(
    `https://api.lens.dev/?query=${encodeURIComponent(query)}&operationName=Profile`,
  );
  return result.json();
};

// const query =
//   'query Profile { profile(request: { handle: "m0nt0y4.lens" }) { ownedBy } }';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.domain - The domain to be resolved.
 * @returns The result of the lens lookup.
 */
export const onNameLookup = async ({ domain }: any) => {
  const result = await lensLookup(domain);
  const { profile } = result.data;
  if (profile?.ownedBy) {
    return { resolvedAddress: profile.ownedBy };
  }
  return null;
};
