export const coinTossTemplate = `
Extract the following details to flip a coin:
- **betAmount** (String): The amount to wager.
- **face** (String): The side of the coin to bet on. Can be either:
  - HEADS
  - TAILS
- **token** (String): The optional token symbol.

Provide the values in the following JSON format:

\`\`\`json
{
    "betAmount": string,
    "face": string,
    "token": string
}
\`\`\`

Here are example messages and their corresponding responses:

**Message 1**

\`\`\`
Bet 0.01 ETH on heads
\`\`\`

**Response 1**

\`\`\`json
{
    "betAmount": "0.01",
    "face": "heads",
    "token" "ETH"
}
\`\`\`

**Message 2**

\`\`\`
Double or nothing 0.5 on heads
\`\`\`

**Response 2**

\`\`\`json
{
    "betAmount": "0.5",
    "face": "HEADS",
    "token": "",
}
\`\`\`

Here are the recent user messages for context:
{{recentMessages}}
`;
