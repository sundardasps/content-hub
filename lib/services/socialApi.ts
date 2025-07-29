import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface SocialPost {
  id: number;
  platform: string;
  hashtag: string;
  content: string;
  author: string;
  createdAt: string;
}

export const socialApi = createApi({
  reducerPath: "socialApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getSocialPosts: builder.query<SocialPost[], string[]>({
      // preferences array → comma separated tags
      query: (tags) => `/social?tags=${encodeURIComponent(tags.join(","))}`,
    }),
  }),
});

export const { useGetSocialPostsQuery } = socialApi;
