// Type definitions to work around Prisma client generation issues
// These should match the schema.prisma file

export enum UserRole {
  owner = 'owner',
  admin = 'admin',
  manager = 'manager',
  user = 'user'
}

export enum MatchStatus {
  scheduled = 'scheduled',
  live = 'live',
  completed = 'completed'
}

export enum OptedTo {
  bat = 'bat',
  bowl = 'bowl'
}

// Basic Prisma namespace for type compatibility
export namespace Prisma {
  export type MatchGetPayload<T> = {
    id: string;
    title: string;
    status: MatchStatus;
    teamAId: string;
    teamBId: string;
    winnerId?: string | null;
    teamA: { id: string; name: string; logo?: string | null };
    teamB: { id: string; name: string; logo?: string | null };
    winner?: { id: string; name: string } | null;
    scores: Array<{
      id: string;
      runs: number;
      balls: number;
      fours: number;
      sixes: number;
      isOut: boolean;
      over: number;
      player: { id: number; name: string; teamId?: string | null };
      createdAt: Date;
    }>;
    createdAt: Date;
  } & (T extends { include: any } ? T['include'] : {});
}