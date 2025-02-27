import type { Plugin } from "@moxie-protocol/core";
import { coinTossAction } from "./actions/coinTossAction";

const betswirlPlugin: Plugin = {
    name: "betswirl",
    description: "Wager on BetSwirl",
    actions: [coinTossAction],
    providers: [],
    evaluators: [],
    services: [],
    clients: [],
};

export default betswirlPlugin;
