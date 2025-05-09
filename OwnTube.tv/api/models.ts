import { VideoChannelSummary, Video } from "@peertube/peertube-types";

export interface Channel {
  id: number;
  name: string;
  displayName: string;
  url: string;
  host: string;
  avatars: Array<{
    width: number;
    path: string;
    createdAt: string;
    updatedAt: string;
  }>;
  avatar: {
    width: number;
    path: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type GetVideosVideo = Pick<
  Video,
  | "uuid"
  | "name"
  | "description"
  | "duration"
  | "publishedAt"
  | "originallyPublishedAt"
  | "views"
  | "isLive"
  | "viewers"
  | "state"
> & {
  previewPath: string;
  category: { id: number | null; label: string };
  channel: VideoChannelSummary;
};

export type PeertubeInstance = {
  id: number;
  host: string;
  name: string;
  shortDescription: string;
  description: string;
  version: string;
  signupAllowed: boolean;
  signupRequiresApproval: boolean;
  userVideoQuota: number;
  liveEnabled: boolean;
  categories: number[];
  languages: string[];
  autoBlacklistUserVideosEnabled: boolean;
  defaultNSFWPolicy: "do_not_list" | "display" | "blur";
  isNSFW: boolean;
  avatars: Array<{ width: number; url: string; path: string }>;
  banners: Array<{ width: number; url: string; path: string }>;
  totalUsers: number;
  totalVideos: number;
  totalLocalVideos: number;
  totalInstanceFollowers: number;
  totalInstanceFollowing: number;
  supportsIPv6: boolean;
  country: string;
  health: number;
  createdAt: number;
};

export class OwnTubeError {
  constructor({ text, code, message }: { text?: string; code?: number; message: string }) {
    this.text = text || "Unexpected";
    this.code = code;
    this.message = message;
  }
  public text: string;
  public code?: number;
  public message: string;
}
