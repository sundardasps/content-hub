import React from "react";
import { render, screen } from "@testing-library/react";
import PersonalizedFeed from "@/app/dashboard/feed/page";

// Mock hooks
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock("@/lib/store", () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (fn: any) =>
    fn({
      user: {
        id: "user123",
        profile: {
          user123: {
            preferences: ["general", "tech"],
          },
        },
      },
      userFavorites: {
        ids: ["https://example.com/news1"],
        entities: {
          "https://example.com/news1": {
            id: "https://example.com/news1",
          },
        },
      },
    }),
}));


jest.mock("@/lib/services/newsApi", () => ({
  useGetTopHeadlinesQuery: () => ({
    data: {
      articles: [
        {
          url: "https://example.com/news1",
          title: "Test News Title",
          description: "Test description",
          urlToImage: "https://example.com/image.jpg",
        },
      ],
      totalResults: 1,
    },
    isLoading: false,
    isFetching: false,
    error: null,
  }),
}));

// Optional: mock ContentCard if you want to isolate UI
jest.mock("@/components/ContentCard", () => (props: any) => (
  <div data-testid="content-card">{props.title}</div>
));

describe("PersonalizedFeed", () => {
  it("renders articles when data is loaded", () => {
    render(<PersonalizedFeed />);

    // Assert that mocked article appears
    expect(screen.getByText("Test News Title")).toBeInTheDocument();
  });
});
