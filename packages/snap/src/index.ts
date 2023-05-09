import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';

const lensLookup = async function(name:String) { 
  const query = `query Profile { profile(request: { handle: "${name}" }) { ownedBy } }`; 
  const result = await fetch('https://api.lens.dev/?query='+encodeURIComponent(query)+'&operationName=Profile'); 
  return result.json(); 
}; 

const query = 'query Profile { profile(request: { handle: "m0nt0y4.lens" }) { ownedBy } }'; 

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      const query = await snap.request({ 
        method: 'snap_dialog', 
        params: { 
          type: 'prompt', 
          content: panel([
            text('**Lookup a Lens ID**'), 
            text('Enter the name to lookup:'), 
          ]), 
        }
      }); 
      const response = []; 
      if(typeof query == 'string') { 
        const result = await lensLookup(query.trim()); 
        const profile = result.data.profile; 
        if(profile && profile.hasOwnProperty("ownedBy")) { 
          response.push(text(`**Address found for ${query}!**`)); 
          response.push(text(profile.ownedBy)); 
        }
        else { 
          response.push(text(`No address was found for ${query}.`)); 
        }
      }
      else { 
        response.push(text('Please enter a name to lookup!')); 
      }
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel(response),
        },
      });
    default:
      throw new Error('Method not found.');
  }
};
