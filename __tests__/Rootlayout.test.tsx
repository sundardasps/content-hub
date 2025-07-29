// __tests__/RootLayout.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";

// ✅ Mock must come before importing the component that uses it
jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "geist-sans" }),
  Geist_Mono: () => ({ variable: "geist-mono" }),
}));

import RootLayout from "../app/layout"; // use relative path unless alias is configured

describe("RootLayout", () => {
  it("renders children inside providers", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});
