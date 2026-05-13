import { Meta, StoryObj } from "@storybook/react";
import { Title, TitleSection, TitleSize } from "./title";
import {
  Ri24HoursFill,
  RiCloseLine,
  RiDeleteBin7Fill,
  RiHeart2Fill,
  RiPriceTag3Line,
  RiSearch2Line,
} from "@remixicon/react";
import { css } from "styled-components";

const meta: Meta<typeof Title> = {
  title: "Content/Title",
  component: Title,
  parameters: {
    layout: "centered",
    docs: {},
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const WithACustomAction: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        styles: {
          toggleActionStyle: css`
            padding: 2px;
            width: 20px;
            height: 20px;
          `,
        },
        actions: [
          {
            icon: { image: RiCloseLine },
            onClick: () => {
              console.log("close was clicked");
            },
          },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          minWidth: "350px",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Default Modal"
            icon={{
              image: Ri24HoursFill,
            }}
            rightSection={rightSection}
          />
        ))}
      </div>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Yolo v8"
            pretitle="Compile"
            subtitle="Model: 2024-12-05"
          />
        ))}
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        actions: [
          {
            icon: { image: RiHeart2Fill },
            onClick: () => {
              console.log("heart was clicked");
            },
            caption: "Heart",
          },
          {
            icon: { image: RiSearch2Line },
            onClick: () => {
              console.log("search was clicked");
            },
            caption: "Search",
          },
          {
            icon: { image: RiPriceTag3Line },
            onClick: () => {
              console.log("price tag was clicked");
            },
            caption: "Price Tag",
          },
          {
            icon: { image: RiDeleteBin7Fill },
            onClick: () => {
              console.log("delete bin was clicked");
            },
            caption: "Delete Bin",
          },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          minWidth: "450px",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Coneto - React UI"
            styles={{
              containerStyle: css`
                padding: 10px;
                background-color: #6200ee;
                align-items: center;
              `,
            }}
            rightSection={rightSection}
          />
        ))}
      </div>
    );
  },
};
