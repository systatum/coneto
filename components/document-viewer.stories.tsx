import type { Meta, StoryObj } from "@storybook/react";
import { DocumentViewer } from "./document-viewer";
import { css } from "styled-components";

const meta: Meta<typeof DocumentViewer> = {
  title: "Content/DocumentViewer",
  component: DocumentViewer,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <DocumentViewer
        onRegionSelected={({ x, y, width, height }) =>
          console.log(x, y, width, height)
        }
        source="/sample.pdf"
      />
    );
  },
};
