export type BotStatus = {
  connected: boolean;
  channel: string;
  botUserId: string | null;
};

export type Command = {
  name: string;
  response: string;
  builtin: boolean;
};

export type CommandsResponse = {
  commands: Command[];
};

export type HealthResponse = {
  ok: boolean;
};
