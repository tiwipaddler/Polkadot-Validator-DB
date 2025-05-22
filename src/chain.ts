import { dot } from "@polkadot-api/descriptors";
import { createClient } from "polkadot-api";
import { withLogsRecorder } from "polkadot-api/logs-provider";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { getWsProvider } from "polkadot-api/ws-provider/web";

const provider = withPolkadotSdkCompat(getWsProvider("wss://rpc.polkadot.io"));
const loggedProvider = withLogsRecorder(console.debug, provider);

export const client = createClient(loggedProvider);

export const typedApi = client.getTypedApi(dot);