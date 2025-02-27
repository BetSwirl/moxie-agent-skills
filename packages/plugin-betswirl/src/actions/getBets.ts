import {
    type Action,
    type IAgentRuntime,
    type Memory,
    type HandlerCallback,
    type State,
    elizaLogger,
    type ActionExample,
    composeContext,
    generateObject,
    ModelClass,
} from "@moxie-protocol/core";
import { MoxieWalletClient } from "@moxie-protocol/moxie-lib/src/wallet";
import { getBetsTemplate } from "../templates";
import { GetBetsParameters } from "../types";
import { type Hex } from "viem";
import {
    CASINO_GAME_TYPE,
    CasinoChainId,
    casinoChainIds,
} from "@betswirl/sdk-core";
import { getBets } from "../utils/betswirl";

export const getBetsAction: Action = {
    name: "GET_BETS",
    similes: ["RETRIEVE_BETS", "SHOW_BETS", "LAST_BETS"],
    description: "Get bets",
    suppressInitialMessage: true,
    validate: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State
    ) => true,
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        try {
            elizaLogger.log("Starting GET_BETS handler...");

            // Initialize or update state
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            const context = composeContext({
                state,
                template: getBetsTemplate,
            });

            const coinTossDetails = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.SMALL,
                schema: GetBetsParameters,
            });

            // Validate the chain
            const wallet = state.agentWallet as MoxieWalletClient;
            const chainId = Number(
                (await wallet.wallet.provider.getNetwork()).chainId
            ) as CasinoChainId;
            if (!casinoChainIds.includes(chainId)) {
                throw new Error(
                    `The chain id must be one of ${casinoChainIds.join(", ")}`
                );
            }

            // Validates the inputs
            const { bettor, game, token } = coinTossDetails.object as {
                bettor: string;
                game: string;
                token: string;
            };

            elizaLogger.log(
                `Getting ${game ? game : ""} ${token ? token : ""} bets ${bettor ? ` from ${bettor}` : ""} ...`
            );

            const bets = await getBets(
                chainId,
                (bettor ? bettor : wallet.address) as Hex,
                game as CASINO_GAME_TYPE,
                token as Hex
            );

            const resolutionMessage = `Bets list:
${bets.map(
    (bet) =>
        `- ${bet.betDate.toUTCString()}: ${bet.token.symbol} amount ${bet.formattedBetAmount}, payout ${bet.formattedPayout}`
).join(`
`)}`;

            elizaLogger.success(resolutionMessage);
            await callback({
                text: resolutionMessage,
            });
        } catch (error) {
            elizaLogger.error(error.message);
            await callback({
                text: error.message,
            });
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Get bets",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "",
                    action: "GET_BETS",
                },
            },
        ],
    ] as ActionExample[][],
};
