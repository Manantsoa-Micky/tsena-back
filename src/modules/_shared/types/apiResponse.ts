export type TApiResponse = {
  status: number;
  message: string;
  data?: Record<string, unknown> | Record<string, unknown>[];
};
